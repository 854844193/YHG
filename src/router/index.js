import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 登录
const login = r => require.ensure([], () => r(require('@/pages/login')), 'login');
// 管理界面
const manage = r => require.ensure([], () => r(require('@/pages/manage')), 'manage');
// 首页统计数据
const home = r => require.ensure([], () => r(require('@/pages/home')), 'home');
// 人员管理
const userList = r => require.ensure([], () => r(require('@/pages/Member/userList')), 'userList');
const ssNurseList = r => require.ensure([], () => r(require('@/pages/Member/ssNurseList')), 'ssNurseList');
const nssNurseList = r => require.ensure([], () => r(require('@/pages/Member/nssNurseList')), 'nssNurseList');
const foremanList = r => require.ensure([], () => r(require('@/pages/Member/foremanList')), 'foremanList');
const userDistribution = r => require.ensure([], () => r(require('@/pages/Member/userDistribution')), 'userDistribution');
const workerDistribution = r => require.ensure([], () => r(require('@/pages/Member/workerDistribution')), 'workerDistribution');
// 业务数据
const splitAccount = r => require.ensure([], () => r(require('@/pages/BusinessData/splitAccount')), 'splitAccount');
const accountDetails = r => require.ensure([], () => r(require('@/pages/BusinessData/accountDetails')), 'accountDetails');
const newOrderAcount = r => require.ensure([], () => r(require('@/pages/BusinessData/newOrderAcount')), 'newOrderAcount');
const nurseType = r => require.ensure([], () => r(require('@/pages/BusinessData/nurseType')), 'nurseType');
const orderList = r => require.ensure([], () => r(require('@/pages/BusinessData/orderList')), 'orderList');
const robOrder = r => require.ensure([], () => r(require('@/pages/BusinessData/robOrder')), 'robOrder');
const advertiseList = r => require.ensure([], () => r(require('@/pages/BusinessData/advertiseList')), 'advertiseList');
const needsList = r => require.ensure([], () => r(require('@/pages/BusinessData/needsList')), 'needsList');
const statement = r => require.ensure([], () => r(require('@/pages/BusinessData/statement')), 'statement');
const refund = r => require.ensure([], () => r(require('@/pages/BusinessData/refund')), 'refund');


// 财务管理
const cash = r => require.ensure([], () => r(require('@/pages/Finance/cash')), 'cash');
const cashModel = r => require.ensure([], () => r(require('@/pages/Finance/cashModel')), 'cashModel');
const Fstatement = r => require.ensure([], () => r(require('@/pages/Finance/statement')), 'statement');
const Fwarrant = r => require.ensure([], () => r(require('@/pages/Finance/warrant')), 'warrant');
const Frefund = r => require.ensure([], () => r(require('@/pages/Finance/refund')), 'refund');
const renew = r => require.ensure([], () => r(require('@/pages/Finance/renew')), 'renew');
const incomeDetails = r => require.ensure([], () => r(require('@/pages/Finance/incomeDetails')), 'incomeDetails');
const invoice = r => require.ensure([], () => r(require('@/pages/Finance/invoice')), 'invoice');
const invoiceRecords = r => require.ensure([], () => r(require('@/pages/Finance/invoiceRecords')), 'invoiceRecords');
//保险
const robInsure = r => require.ensure([], () => r(require('@/pages/Insurance/robInsure')), 'robInsure');
const foremanInsure = r => require.ensure([], () => r(require('@/pages/Insurance/foremanInsure')), 'foremanInsure');
const insureDataInput = r => require.ensure([], () => r(require('@/pages/Insurance/insureDataInput')), 'insureDataInput');
const insureFliter = r => require.ensure([], () => r(require('@/pages/Insurance/insureFliter')), 'insureFliter');

// 官网维护
const officenews = r => require.ensure([], () => r(require('@/pages/OfficialWeb/officenews')), 'officenews');
const officeFeedback = r => require.ensure([], () => r(require('@/pages/OfficialWeb/officeFeedback')), 'officeFeedback');
const officeIntroduction = r => require.ensure([], () => r(require('@/pages/OfficialWeb/officeIntroduction')), 'officeIntroduction');
// 管理员
const adminList = r => require.ensure([], () => r(require('@/pages/Administrators/adminList')), 'adminList');
const mine = r => require.ensure([], () => r(require('@/pages/Administrators/mine')), 'mine');
const right = r => require.ensure([], () => r(require('@/pages/Administrators/right')), 'right');
// 角色管理
const roleManage = r => require.ensure([], () => r(require('@/pages/RoleManage/roleManage')), 'roleManage');

// 证件审核
const certificate = r => require.ensure([], () => r(require('@/pages/Examine/certificate')), 'certificate');
// 设置
const alipayInterface = r => require.ensure([], () => r(require('@/pages/Setting/alipayInterface')), 'alipayInterface');
// 二维码
const QRcode = r => require.ensure([], () => r(require('@/pages/QRcode/QRcode')), 'QRcode');
const scanInfo = r => require.ensure([], () => r(require('@/pages/QRcode/scanInfo')), 'scanInfo');
// 反馈
const feekBack = r => require.ensure([], () => r(require('@/pages/Feedback/feekBack')), 'feekBack');
const questionnaire = r => require.ensure([], () => r(require('@/pages/Feedback/questionnaire')), 'questionnaire');
// 版本管理
const softVersion = r => require.ensure([], () => r(require('@/pages/SoftVersion/softVersion')), 'softVersion');
// 操作说明
const operationLog = r => require.ensure([], () => r(require('@/pages/Operation/operationLog')), 'operationLog');
const explain = r => require.ensure([], () => r(require('@/pages/Operation/explain')), 'explain');

const routes = [{
    path: '/',
    component: login
},
{
    path: '/manage',
    component: manage,
    name: '',
    children: [,
        {
            path: '',
            component: home,
            meta: ['首页'],
        }, {
            path: '/userList',
            component: userList,
            meta: ['人员管理', '用户列表'],
        }, {
            path: '/ssNurseList',
            component: ssNurseList,
            meta: ['人员管理', '自营护工列表'],
        }, {
            path: '/nssNurseList',
            component: nssNurseList,
            meta: ['人员管理', '非自营护工列表'],
        },
        {
            path: '/foremanList',
            component: foremanList,
            meta: ['人员管理', '服务商列表'],
        },
        {
            path: '/splitAccount',
            component: splitAccount,
            meta: ['业务数据', '分账'],
        },
        {
            path: '/accountDetails',
            component: accountDetails,
            meta: ['业务数据', '分账明细'],
        },
        {
            path: '/newOrderAcount',
            component: newOrderAcount,
            meta: ['业务数据', '新表分账明细'],
        },
        {
            path: '/statement',
            component: statement,
            meta: ['业务数据', '结算单'],
        },
        {
            path: '/Fstatement',
            component: Fstatement,
            meta: ['财务管理', '结算单'],
        },
        {
            path: '/refund',
            component: refund,
            meta: ['业务数据', '退款记录'],
        },
        {
            path: '/Frefund',
            component: Frefund,
            meta: ['财务管理', '退款'],
        },
        {
            path: '/invoice',
            component: invoice,
            meta: ['财务管理', '开票'],
        },
        {
            path: '/invoiceRecords',
            component: invoiceRecords,
            meta: ['财务管理', '开票记录'],
        },
        {
            path: '/Fwarrant',
            component: Fwarrant,
            meta: ['财务管理', '退款授权'],
        },
        {
            path: '/incomeDetails',
            component: incomeDetails,
            meta: ['财务管理', '收支明细'],
        },
        {
            path: '/renew',
            component: renew,
            meta: ['财务管理', '订单续费'],
        },
        {
            path: '/nurseType',
            component: nurseType,
            meta: ['业务数据', '护理类别'],
        },
        {
            path: '/cash',
            component: cash,
            meta: ['财务管理', '优惠券'],
        },
        {
            path: '/cashModel',
            component: cashModel,
            meta: ['财务管理', '优惠券模板'],
        },
        {
            path: '/advertiseList',
            component: advertiseList,
            meta: ['业务数据', '广告管理'],
        },
        {
            path: '/robInsure',
            component: robInsure,
            meta: ['保险数据', '抢单保险'],
        },
        {
            path: '/foremanInsure',
            component: foremanInsure,
            meta: ['保险数据', '服务商单保险'],
        },
        {
            path: '/insureDataInput',
            component: insureDataInput,
            meta: ['保险数据', '保险记录'],
        },
        {
            path: '/insureFliter',
            component: insureFliter,
            meta: ['保险数据', '保险过滤'],
        },
        {
            path: '/userDistribution',
            component: userDistribution,
            meta: ['人员管理', '用户分布'],
        }, {
            path: '/workerDistribution',
            component: workerDistribution,
            meta: ['人员管理', '护工分布'],
        }, {
            path: '/roleManage',
            component: roleManage,
            meta: ['角色管理', '角色管理'],
        }, {
            path: '/adminList',
            component: adminList,
            meta: ['管理员', '管理员管理'],
        },
        {
            path: '/mine',
            component: mine,
            meta: ['管理员', '管理员资料'],
        }, {
            path: '/right',
            component: right,
            meta: ['管理员', '权限管理'],
        }, {
            path: '/softVersion',
            component: softVersion,
            meta: ['软件版本管理', '软件版本'],
        }, {
            path: '/certificate',
            component: certificate,
            meta: ['审核', '证件审核'],
        },
        {
            path: '/alipayInterface',
            component: alipayInterface,
            meta: ['设置', '支付接口'],
        },
        {
            path: '/QRcode',
            component: QRcode,
            meta: ['二维码', '生成二维码'],
        },
        {
            path: '/scanInfo',
            component: scanInfo,
            meta: ['二维码', '扫码统计'],
        },
        {
            path: '/orderList',
            component: orderList,
            meta: ['业务数据', '服务商端订单'],
        },
        {
            path: '/robOrder',
            component: robOrder,
            meta: ['业务数据', '小程序端订单'],
        },
        {
            path: '/feekBack',
            component: feekBack,
            meta: ['反馈', '用户反馈'],
        },
        {
            path: '/questionnaire',
            component: questionnaire,
            meta: ['反馈', '有奖问答'],
        }, {
            path: '/operationLog',
            component: operationLog,
            meta: ['操作说明', '操作日志'],
        }, {
            path: '/explain',
            component: explain,
            meta: ['操作说明', '说明'],
        }, {
            path: '/needsList',
            component: needsList,
            meta: ['业务数据', '订单需求表'],
        },
        {
            path: '/officenews',
            component: officenews,
            meta: ['官网维护', '新闻'],
        },
        {
            path: '/officeFeedback',
            component: officeFeedback,
            meta: ['官网维护', '客户反馈'],
        },

        // {
        //     path: '/officeIntroduction',
        //     component: officeIntroduction,
        //     meta: ['官网维护', '简介'],
        // }
    ]
}
]

export default new Router({
    routes,
    strict: process.env.NODE_ENV !== 'production',
})