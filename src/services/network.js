import {network} from '@/config'
import axios from "axios/index";

const sthJs = require('sthjs')

class Network {

  async getSeed(index) {
    let result = {}
    let start = Date.now()
    await axios.get('https://' + network.SEEDS[index] + '/api/loader/status').then(function (data) {
      result.url = network.SEEDS[index]
      result.delay = Date.now() - start
      result.success = true
    }).catch((error) => {
      if (!error.status) {
        result.success = false
        return result
      }
    })
    return result
  }

  async networkInit() {
    let result = {}
    for (let i = 0; i < network.SEEDS.length; i++) {
      let seed = await this.getSeed(i)
      if (seed.success === true) {
        result = seed
        break
      }
    }
    return result
  }

}


export default new Network()
