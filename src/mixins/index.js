import { merge } from 'lodash'

const mixins = [
  require('./main').default,

]

export default merge(...mixins)
