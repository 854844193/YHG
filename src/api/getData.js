import fetch from '@/config/fetch'
import { expect } from 'chai';

/**
 * 登陆 mindy
 */

export const login = data => fetch('/mgr/adminlogin', data, 'POST');

/**
 * api请求量
 */

export const apiCount = date => fetch('/statis/api/' + date + '/count');

/**
 * 所有api请求量
 */

export const apiAllCount = () => fetch('/statis/api/count');

/**
 * 所有api请求信息
 */

export const apiAllRecord = () => fetch('/statis/api/all');

/**
 * 各类用户注册量 mindy
 */

export const getUserCount = data => fetch('/mgr-app-user/selectCountByType?', data);


/**
 * 管理员数量
 */

export const adminCount = () => fetch('/admin/count');

/**
 * 获取订单列表
 */

export const getOrderList = data => fetch('/mgr-nurse-order/mngSelectByCondition?', data, 'GET');

/**
 * 获取抢单列表
 */

export const getRobOrderList = data => fetch('/lfUserNewOrder/mngUserNewOrderPage', data, 'POST');

/**
 * 获取抢单详情
 */
export const getRobOrderInfo = orderNumber => fetch(`/lfUserNewOrder/selectJoinByNurseandBeNurse?orderNumber=${orderNumber}`, {}, 'GET');

/**
 * 获取抢单列表
 */

export const getRenewOrder = data => fetch('/renew/selectRenewRecordByPage', data, 'POST');

/**
 * 获取订单数量
 */

export const getOrderCount = () => fetch('/mgr-nurse-order/selectAllCount');

/**
 * 获取抢单保险数据
 */

export const getForemanInsureList = data => fetch('/mng-insuraceRecord/selectOldOrderByTime', data, 'POST');

/**
 * 获取抢单保险数据
 */

export const getRobInsureList = data => fetch('/mng-insuraceRecord/selectOrderByTime', data, 'POST');

/**
 * 按保险日期获取保险数据
 */

export const searchInsure = data => fetch('/mng-insuraceRecord/selectInsuranceRecord', data, 'POST');

/**
 * 按保险日期获取保险数据
 */

export const importInsure = data => fetch('/mng-insuraceRecord/insertInsuranceRecord', data, 'POST');

/**
 * 获取用户、护工、服务商列表
 */

export const getUserList = data => fetch('/mgr-app-user/mngSelectUserByCondition?', data);

/**
 * 获取服务商下二级护工列表
 */

export const getNursesTable = data => fetch('/mgr-appSecondNurse/queryAllSecondNurseBody?', data);


/**
 * 获取地址信息
 */

export const getAddressById = address_id => fetch('/v1/addresse/' + address_id);

/**
 * 获取用户分布信息
 */

export const getUserCity = () => fetch('/v1/user/city/count');

/**
 * 更新护理类别 mindy
 */
// export const updateNurseType = data => fetch('', data, 'POST');

/**
 * 删除护理类别 mindy
 */

// export const deleteNurseType = restaurant_id => fetch('', {}, 'DELETE');

/**
 * 获取护理类别总数 mindy
 */

export const getNurseTypeCount = data => fetch('/mgr-nurse-type/selectAllCount?', data, 'GET');

/**
 * 新增护理类别 mindy
 */

export const addNurseTypeList = data => fetch('/mgr-nurse-type/insertNurseType', data, 'POST');

/**
 * 获取护理类别列表 mindy
 */
export const getNurseType = data => fetch('/mgr-nurse-type/type?', data);

/**
 * 获取护理类别对应级别列表 mindy
 */
export const addNurseLevel = data => fetch('/mgr-NurseLevel/add', data, 'POST');

/**
 * 获取护理类别对应级别列表 mindy
 */

export const getNurseLevel = data => fetch('/mgr-NurseLevel/getLevelByTypeId?', data);

/**
 * 删除护理级别 mindy
 */

export const deleteNurseLevelByLevelId = id => fetch(`/mgr-NurseLevel/delete/${id}`, {}, 'POST');

/**
 * 删除护理级别 mindy
 */

export const deleteNurseTypeById = id => fetch(`/mgr-nurse-type/deleteById?id=${id}`, {}, 'POST');

/**
 * 获取分账规则 mindy
 */
export const getSplitAccounts = data => fetch('/mgr-alipay-SettlementRule/selectBycondition', data, 'POST');

/**
 * 获取分账列表 mindy
 */
export const getRuleList = data => fetch('/mgr-alipay-SettlementRule/select', data, 'POST');

/**
 * 新增分账场景 mindy
 */
export const addRuleName = data => fetch('/mgr-alipay-SettlementRule/insertRuleName', data, 'POST');

/**
 * 新增分账规则 mindy
 */
export const addRules = data => fetch('/mgr-alipay-SettlementRule/insertRule', data, 'POST');

/**
 * 编辑分账规则 mindy
 */
export const updateRule = data => fetch('/mgr-alipay-SettlementRule/updateRuleById', data, 'POST');

/**
 * 绑定分账规则 mindy
 */
export const bindRule = data => fetch('/mgr-app-user/updateRule?', data, 'GET');

/**
 * 删除分账场景 mindy
 */
export const deleteRule = id => fetch(`/mgr-alipay-SettlementRule/deleteRuleNameByid?id=${id}`, {}, 'GET');

/**
 * 删除分账规则 mindy
 */
export const deleteSimple = id => fetch(`/mgr-alipay-SettlementRule/deleteRuleById?id=${id}`, {}, 'GET');

/**
 * 分账明细 mindy
 */
export const getAccountDetails = data => fetch('/mgr-alipay-SettlementRule/getSchedules', data, 'POST');

/**
 * 新表分账明细 mindy
 */
export const getNewAccountDetails = data => fetch('/mgr-alipay-SettlementRule/getSchedulesv2', data, 'POST');

/**
 * 获取优惠卷列表 mindy
 */
export const getCouponList = data => fetch('/mgr-coupon/selectLfcCouponPage', data, 'POST');

/**
 * 获取优惠卷模板 mindy
 */
export const getCouponModel = data => fetch('/couponRule/selectcCouponRule', data, 'POST');

/**
 * 创建优惠卷模板 mindy
 */
export const createModel = data => fetch('/couponRule/saveCouponRule', data, 'POST');

/**
 * 删除优惠卷模板 mindy
 */
export const deleteModel = data => fetch('/couponRule/deleteCouponRule', data, 'POST');

/**
 * 新增优惠卷 mindy
 */
export const addCouCash = data => fetch('/couponRule/coupon', data, 'POST');

/**
 * 删除优惠券 mindy
 */
export const deleteCouCash = id => fetch(`/mgr-coupon/deletedConpon?id=${id}`, {}, 'POST');


/**
 * 添加权限 mindy
 */
export const addPermission = data => fetch('/permission/save', data, 'POST');

/**
 * 权限角色列表获取 mindy
 */
export const getRoleList = () => fetch('/role/listAll');

/**
 * 绑定角色mindy
 */
export const bindRole = data => fetch('/role/roleBingUser?', data);

/**
 * 查找角色mindy
 */
export const findRole = data => fetch('/role/findRolesByUserId?', data);

/**
 * 管理员列表 mindy
 */
export const getManagerList = data => fetch('/mgr/selectAll', data, 'GET');

/**
 * 添加管理员 mindy
 */
export const addManager = data => fetch('/mgr/insertAdmin', data, 'POST');

/**
 * 删除管理员 mindy
 */
export const deleteManager = id => fetch(`/mgr/deletedById?id=${id}`, {}, 'POST');

/**
 * 更新管理员 mindy
 */
export const updateManager = data => fetch('/mgr/updateAdminInfo', data, 'POST');

/**
 * 权限角色添加 mindy
 */
export const addRole = (code, name) => fetch(`/role/save?code=${code}&name=${name}`, (code, name), 'POST');

/**
 * 权限角色更新 mindy
 */
export const updateRole = data => fetch('/role/update', data, 'POST');

/**
 * 权限角色删除 mindy
 */
export const deleteRole = data => fetch('/role/deletedUserRoles?', data);

/**
 * 角色所有权限的查询 mindy
 */
export const getPermList = () => fetch('/permission/findPermissions?');

/**
 * 角色权限绑定 mindy
 */
export const setPermList = data => fetch(`/role/permissions`, data, 'POST');

/**
 * 角色对应权限的查询 mindy
 */
export const getRolePerm = data => fetch('/role/findPermissionsByRoleId?', data);

/**
 * 添加角色的权限关系 mindy
 */
export const setRolePermiision = (id, data) => fetch(`/role/${id}/permissions`, data);

/**
 * 获取人权信息 mindy
 */
// export const getAllPersonPermission = () => fetch('');

/**
 * 获取人权信息 mindy
 */
export const getPersonPermissionByUserId = (userId, data) => fetch(`/mgr_person_permission/findByUserid?userId=${userId}`, data, 'GET');

/**
 * 添加人权信息 mindy
 */
export const addPersonPermission = data => fetch('/mgr_person_permission/save', data, 'POST');

/**
 * 更改人权信息 mindy
 */
export const updatePersonPermission = data => fetch('/mgr_person_permission/update', data, 'PUT');

/**
 * 重置密码 mindy
 */
export const resetPassword = data => fetch('/mgr/updatePassword', data, 'POST');

/**
 * 获取版本列表 mindy
 */
export const getAppVersion = data => fetch('/mgr-app-version/selectAppVersion', data, 'POST');

/**
 * 上传新版本 mindy
 */
export const submitVersion = data => fetch('/mgr-app-version/saveAppVersion', data, 'POST');

/**
 * 删除版本 mindy
 */
export const deleteVersion = data => fetch('/mgr-app-version/deleteAppVersion', data, 'POST');

/**
 * 获取用户反馈信息 mindy
 */
export const getAllFeekback = data => fetch('/mgr-feekback/SelectAll?', data, 'GET');
/**
 * 删除用户反馈信息 mindy
 */
export const deletedFeedBack = data => fetch(`/mgr-feekback/deletedinfo?id=${data}`, data, "POST");

/**
 * 获取用户数 mindy
 */
export const getAppUserCount = data => fetch('/mgr-count/countByAppUser?', data, 'GET');


/**
 * 获取订单数 mindy
 */
export const getNewOrderCount = data => fetch('/mgr-count/countOrder?', data, 'GET');

/**
 * 获取需求数 mindy
 */
export const getNeedCount = data => fetch('/mgr-count/countNeed?', data, 'GET');


/**
 * 文件上传 mindy
 */
// export const uploadFile = data => fetch('/mgr-file-upload/upload', data, 'POST');
export const uploadFile = data => fetch('/mgr-file-upload/upload', data, 'POST', 'upload');

/**
 * 预约服务表 mindy
 */
export const getNeedsList = data => fetch('/mgr-nurse-needs/list?', data);
/**
 * 根据条件查询服务 mindy
 */
export const getNeedByCondition = data => fetch('/mgr-nurse-needs/selectNeedByCondition?', data);

/**
 * 根据条件修改服务 mindy
 */
export const updateNeeds = data => fetch('/mgr-nurse-needs/updateByCondition', data, 'POST');

/**
 * 预约服务表总数 mindy
 */
export const getNeedsCount = () => fetch('/mgr-nurse-needs/getNeedAllNumber');


/**
 * 批量添加护工 mindy
 */
export const batchAddUser = data => fetch('/mgr-app-user/batchAddUser', data, 'POST');


/**
 * 查询平台总流水 mindy
 */
export const getAllOrderAmount = () => fetch('/mgr-nurse-order/getAllOrderAmount');

/**
 * 查询交易额 mindy
 */
export const getIncome = data => fetch('/ReportForm/income?', data);

/**
 * 查询交易订单 mindy
 */
export const getOrder = data => fetch('/ReportForm/order?', data);


/**
 * 获取浏览次数 mindy
 */
export const getClickNum = () => fetch('/mgr-app-statis/getClickNum', {});


/**
 * 删除某个用户、护工、服务商的信息 mindy
 */
export const deletedByUser = data => fetch('/mgr-app-user/deleted', data, "POST");

/**
 * 获取某个用户的信息 mindy
 */
export const getSearchData = data => fetch('/mgr-app-user/mngSelectUserByCondition?', data);

/**
 * 修改用户信息 mindy
 */
export const updateInfo = data => fetch('/mgr-app-user/updateinfo', data, 'POST');

/**
 * 添加护工 mindy
 */
export const addNurse = data => fetch('/mgr-app-user/batchAddUser', data, 'POST');

/**
 * 关联护工 mindy
 */
export const BindNurse = (nurseId, parentId) => fetch(`/mgr-appSecondNurse/relationNurse?nurseId=${nurseId}&parentId=${parentId}`, {}, 'POST');

/**
 * 解除绑定的护工 mindy
 */
// export const relieveSecondNurse = data => fetch('/mgr-appSecondNurse/relieve', data, 'POST');
export const relieveSecondNurse = (nurseId, parentId) => fetch(`/mgr-appSecondNurse/relieve?nurseId=${nurseId}&parentId=${parentId}`, {}, 'POST');

/**
 * 修改优惠券 mindy
 */
export const editCash = data => fetch('/mgr-coupon/updateInfo', data, 'POST');

/**
 * 查询订单 mindy
 */
export const getOrderByCondition = data => fetch('/mgr-nurse-order/mngSelectByCondition?', data);

/**
 * 查询订单 mindy
 */
export const getOrderTable = data => fetch('/mgr-pay-order/selectPayOrderDetailByCondition?', data);

/**
 * 查询已支付的订单 mindy
 */
export const getPayedOrder = data => fetch('/mgr-pay-order/selectPayOrderDetailByCondition?', data);

/**
 * 查询已支付的订单的金额 mindy
 */
export const getPayAmount = data => fetch('/mgr-pay-order/selectPayOrderDetailCount', data, 'POST');

/**
 * 查询平台收支明细 
 */
export const getIncomes = data => fetch('/mgr-pay-order/selectPayOrderInfo?', data,);

/**
 * 查询平台收支明细 
 */
export const getAmount = data => fetch('/mgr-pay-order/selectPayOrderInfoCount', data, 'POST');

/**
 * 查询符合分账的订单的总数 mindy
 */
export const getOrderAccountCount = () => fetch('/mng-PrePayDetail/selectAllCount?');

/**
 * 查询符合结算的订单 mindy
 */
export const getSetteleOrder = data => fetch('/mgr-nurse-order/selectOrderSetteleInfo', data, 'POST');

/**
 * 订单的结算 mindy
 */
export const orderSettele = orderId => fetch(`/mgr-pay/confirmSettlement?orderId=${orderId}`, {}, 'PUT');

/**
 * 退款记录查询 mindy
 */
export const getRefundOrder = data => fetch('/RefundController/selectRefundInfo', data, 'POST');

/**
 * 退款审核 mindy
 */
export const orderRefund = data => fetch('/mgr-pay/refund', data, 'POST');

/**
 * 获取广告数量 mindy
 */
export const getAdvertiseCount = () => fetch('/mgr-advertise/selectAllAdvertiseCount');

/**
 * 根据条件搜索广告 mindy
 */
export const searchAdvertise = data => fetch('/mgr-advertise/selectByCondition?', data);

/**
 * 添加广告信息 mindy
 */
export const addAdvertise = data => fetch('/mgr-advertise/insertAdv', data, 'POST');

/**
 * 更新广告信息 mindy
 */
export const updateAdvertise = data => fetch('/mgr-advertise/updateAdvInfo', data, 'POST');

/**
 * 删除广告信息 mindy
 */
export const deletedAdvertise = id => fetch(`/mgr-advertise/deletedById?id=${id}`, {}, 'POST');

/**
 * 获取新闻信息 mindy
 */
export const getAllNews = data => fetch('/mgr-Cms/selectByCondition?', data);

/**
 * 获取新闻数量 mindy
 */
export const getAllNewsCount = data => fetch('/mgr-Cms/selectAllCountByType?', data);

/**
 * 更新新闻信息 mindy
 */
export const updateNews = data => fetch('/mgr-Cms/updateById', data, 'POST');

/**
 * 添加新闻消息 mindy
 */
export const addNews = data => fetch('/mgr-Cms/add', data, 'POST');

/**
 * 删除新闻信息 mindy
 */
export const deletedNews = id => fetch(`/mgr-Cms/delete?id=${id}`, {}, 'POST');

/**
 * 获取客户留言 mindy
 */
export const getAllComments = data => fetch('/mgr-contact-us/selectAllByLately?', data);

/**
 * 获取留言数量 mindy
 */
export const getCommentsCount = () => fetch('/mgr-contact-us/selectAllCount');

/**
 * 删除留言 mindy
 */
export const deletedComments = id => fetch(`/mgr-contact-us/deletedById?id=${id}`, {}, 'POST');

/**
 * 搜索留言 mindy
 */
export const searchComments = data => fetch('/mgr-contact-us/selectByCondition', data, 'POST');

/**
 * 护工二维码 mindy
 */
export const getUserQRcode = data => fetch('/mgr-app-user/generateQRcode?', data);

/**
 * 护工小程序二维码 mindy
 */
export const getWeiQRcode = data => fetch('/CreateQRCode/createQRCodeV2', data, 'POST');

/**
 * 添加订单备注 mindy
 */
export const addRemark = data => fetch('/mgr-nurse-order/mngAddRemark?', data);

/**
 * 服务商支付密码添加 mindy
 */
export const editPwd = data => fetch('/PayPwd/updateByPrimaryKeySelective?', data, 'POST');

/**
 * 服务商支付密码查询 mindy
 */
export const readPwd = data => fetch('/PayPwd/selectByPrimaryKey?', data);

/**
 * 服务商支付密码修改 mindy
 */
export const addPwd = data => fetch('/PayPwd/insertSelective', data, 'POST');

/**
 * 服务商绑定收款人 mindy
 */
export const setCollection = data => fetch('/mgr-app-user/insetRefundId?', data);

/**
 * 退款授权信息查询 mindy
 */
export const selectEmpower = data => fetch('/LfEmpower/selectByPrimaryKey', data, 'POST');

/**
 * 退款授权信息添加 mindy
 */
export const insertEmpower = data => fetch('/LfEmpower/insertSelective', data, 'POST');

/**
 * 退款授权信息添加 mindy
 */
export const editEmpower = data => fetch('/LfEmpower/updateByPrimaryKeySelective', data, 'POST');

/**
 * 退款授权信息添加 mindy
 */
export const deleteEmpower = data => fetch('/LfEmpower/deleteByPrimaryKey?', data,);

/**
 * 退款授权信息添加 mindy
 */
export const getRecords = data => fetch('/promotionRecord/selectMerchantrecord', data, 'POST');

/**
 * 退款授权信息添加 mindy
 */
export const selectUsers = data => fetch('/promotionRecord/selectMerchantInfo', data, 'POST');

/**
 * 开票 mindy
 */
export const invoiceCreat = data => fetch('/invoice/invoiceCreat', data, 'POST');

