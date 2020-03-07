import axios from 'axios'
import {network} from '@/config'

class SmartHolder {
  async getHolders() {
    return (await axios.get(network.SMARTHOLDER + '/api/public/percents')).data || null
  }

  async getAssetsPay() {
    return (await axios.get(network.SMARTHOLDER + '/api/get/assets')).data || null
  }

  async getAssetsNoq() {
    return (await axios.get(network.SMARTHOLDER + '/api/get/noassets')).data || null
  }

  async latestReportCountRemote() {
    return (await axios.get('https://news.xbts.io/xbtsreports/count')).data || null
  }

  async fetchLatestReports() {
    return (await axios.get('https://news.xbts.io/xbtsreports?_limit=12&_sort=id:DESC')).data || null
  }
}


export default new SmartHolder()
