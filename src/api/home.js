import request from '@/utils/request'

export function getTable(data) {
  return request({
    url: '/order/mission?' + data,
    method: 'get'
  })
}
export function createAddress(data) {
  return request({
    url: '/order/account',
    method: 'post',
    data
  })
}
export function downAddress(data) {
  return request({
    url: '/order/mission/' + data,
    method: 'get'
  })
}
export function signTable(data) {
  return request({
    url: '/order/sign?' + data,
    method: 'get'
  })
}
export function fee(data) {
  return request({
    url: '/order/gas',
    method: 'get'
  })
}
export function modifyFee(data) {
  return request({
    url: '/order/gas',
    method: 'put',
    data
  })
}
export function deleteInfo(id) {
  return request({
    url: '/order/account/' + id,
    method: 'delete'
  })
}
