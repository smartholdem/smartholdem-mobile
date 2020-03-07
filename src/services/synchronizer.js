import { flatten, includes, isFunction, pullAll } from 'lodash'
import { balance, tx, market, status, priceHistory, holders, assetsPay, assetsNoq} from './synchronizer/'
/**
 * This class adds the possibility to define actions (not to confuse with Vuex actions)
 * that could be dispatched using 2 modes: `default` and `focus`.
 *
 * Each mode has an interval configuration that establishes the delay until the
 * next update:
 *  - `focus` should be used on sections that display that kind of data to users
 *  - `default` should be used to check if new data is available
 *
 * There is also a way to pause and unpause the synchronization that is useful
 * for not executing actions when the users do not need fresh data.
 */
export default class Synchronizer {
  get intervals () {
    // STH block production time
    const block = 8000

    const intervals = {
      longest: block * 300,
      longer: block * 100,
      medium: block * 25,
      shorter: block * 10,
      shortest: block * 3,
      block,
      // Number of milliseconds to wait to evaluate which actions should be run
      loop: 2000
    };

    return intervals
  }

  get config () {
    const { loop, shortest, shorter, medium, longer, longest } = this.intervals;

    const config = {
      balance: {
        default: { interval: shortest },
        focus: { interval: loop }
      },
      tx: {
        default: { interval: shortest },
        focus: { interval: loop }
      },
      market: {
        default: { interval: medium },
        focus: { interval: loop }
      },
      status: {
        default: { interval: shortest },
        focus: { interval: loop }
      },
      priceHistory: {
        default: { interval: medium },
        focus: { interval: loop }
      },
      holders: {
        default: {interval: longest},
        focus: {interval: loop}
      },
      assetsPay: {
        default: {interval: longest},
        focus: {interval: loop}
      },
      assetsNoq: {
        default: {interval: longest},
        focus: {interval: loop}
      },
    };

    return config
  }

  get $store () {
    return this.scope.$store
  }

  /**
   * @param {Object} config
   * @param {Vue} config.scope - Vue instance that would be synchronized
   */
  constructor ({ scope }) {
    this.scope = scope
    this.actions = {}
    this.focused = []
    this.paused = []
  }

  /**
   * Define an action that would be called later periodically
   * @param {String} actionId
   * @param {Object} config
   * @param {Function} actionFn
   */
  define (actionId, config, actionFn) {
    if (!isFunction(actionFn)) {
      throw new Error('[$synchronizer] action is not a function')
    }
    ['default', 'focus'].forEach(mode => {
      const { interval } = config[mode]
      if (!interval && interval !== null) {
        throw new Error(`[$synchronizer] \`interval\` for \`${mode}\` mode should be a Number bigger than 0 (or \`null\` to ignore it)`)
      }
    })

    this.actions[actionId] = {
      calledAt: 0,
      isCalling: false,
      fn: actionFn,
      ...config
    }
  }

  /**
   * Focus on these actions: instead of refreshing their data on the normal pace,
   * change to the `focus` frequency.
   *
   * Focusing on 1 or several actions, unfocused the rest
   * @params {(...String|Array)} actions - ID of the actions to focus on
   */
  focus (...actions) {
    this.focused = flatten(actions)
    this.unpause(this.focused)
  }

  /**
   * Pause these actions. They would not be dispatched until they are unpaused
   * or focused
   * @params {(...String|Array)} actions - ID of the actions to pause
   */
  pause (...actions) {
    this.paused = flatten(actions)
  }

  /**
   * Enable these paused actions again
   * @params {(...String|Array)} actions - ID of the actions to unpause
   */
  unpause (...actions) {
    pullAll(this.paused, flatten(actions))
  }

  /**
   * Trigger these actions 1 time.
   * As a consequence the interval of those actions is updated.
   * @params {(...String|Array)} actions - ID of the actions to unpause
   */
  trigger (...actions) {
    flatten(actions).forEach(actionId => this.call(actionId))
  }

  /**
   * Invoke the action and update the last time it has been called, when
   * it has finished its sync or async execution
   * @param {String} actionId
   */
  async call (actionId) {
    const action = this.actions[actionId]
    if (!action) {
      return
    }

    action.isCalling = true
    await action.fn()
    action.calledAt = (new Date()).getTime()
    action.isCalling = false
  }

  /*
   * Starts to dispatch the actions periodically
   */
  ready () {
    /**
     * Run all the actions
     */
    const run = (options = {}) => {
      Object.keys(this.actions).forEach(actionId => {
        if (!includes(this.paused, actionId)) {
          const action = this.actions[actionId]

          if (!action.isCalling) {
            if (options.immediate) {
              this.call(actionId)
            } else {
              const mode = includes(this.focused, actionId) ? 'focus' : 'default'
              const { interval } = action[mode]

              // A `null` interval means no interval, so the action does not run
              if (interval !== null) {
                // Delay the beginning of the periodic action run
                if (!action.calledAt && action[mode].delay) {
                  action.calledAt += action.delay
                }

                const nextCallAt = action.calledAt + interval
                const now = (new Date()).getTime()

                if (nextCallAt <= now) {
                  this.call(actionId)
                }
              }
            }
          }
        }
      })
    }

    const runLoop = () => {
      // Using `setTimeout` instead of `setInterval` allows waiting to the
      // completion of async functions
      setTimeout(() => {
        run()
        runLoop()
      }, this.intervals.loop)
    }

    // Run the first time
    run({ immediate: true })
    runLoop()
  }

  defineAll () {
    this.define('balance', this.config.balance, async () => {
      await balance(this)
    })

    this.define('tx', this.config.tx, async () => {
      await tx(this)
    })

    this.define('market', this.config.market, async () => {
      await market(this)
    })

    this.define('status', this.config.status, async () => {
      await status(this)
    })

    this.define('priceHistory', this.config.priceHistory, async () => {
      await priceHistory(this)
    })

    this.define('holders', this.config.holders, async () => {
      await holders(this)
    })

    this.define('assetsPay', this.config.assetsPay, async () => {
      await assetsPay(this)
    })

    this.define('assetsNoq', this.config.assetsNoq, async () => {
      await assetsNoq(this)
    })

  }
}
