export const permLists = [
    {
        name: "人员管理",
        permission: false,
        sub: [
            { name: "用户列表", permission: 0 },
            { name: "自营护工列表", permission: 0, },
            { name: "非自营护工列表", permission: 0, },
            { name: "服务商列表", permission: 0, },
            { name: "用户分布", permission: 0 },
            { name: "护工分布", permission: 0 },
        ]
    },
    {
        name: "业务数据",
        permission: false,
        sub: [
            { name: "分账", permission: 0 },
            { name: "分账明细", permission: 0 },
            { name: "新表分账明细", permission: 0 },
            { name: "护理类别", permission: 0 },
            { name: "订单需求表", permission: 0 },
            { name: "服务商端订单", permission: 0 },
            { name: "小程序端订单", permission: 0 },
            { name: "结算记录", permission: 0 },
            { name: "退款记录", permission: 0 },
            { name: "广告管理", permission: 0 }
        ]
    },
    {
        name: "财务管理",
        permission: false,
        sub: [
            { name: "开票", permission: 0 },
            { name: "开票记录", permission: 0 },
            { name: "结算单", permission: 0 },
            { name: "订单续费", permission: 0 },
            { name: "退款审核", permission: 0 },
            { name: "退款授权", permission: 0 },
            { name: "收支明细", permission: 0 },
            { name: "优惠券", permission: 0 },
            { name: "优惠券模板", permission: 0 },
        ]
    },
    {
        name: "保险数据",
        permission: false,
        sub: [
            { name: "抢单保险", permission: 0 },
            { name: "服务商单保险", permission: 0 },
            { name: "保险记录", permission: 0 },
            // { name: "保险过滤", permission: 0 },
        ]
    },
    {
        name: "官网维护",
        permission: false,
        sub: [
            { name: "新闻", permission: 0 },
            // { name: "简介", permission: 0 },
            { name: "客户反馈", permission: 0 },
        ]
    },
    {
        name: "管理员",
        permission: false,
        sub: [
            { name: "管理员管理", permission: 0 },
            { name: "管理员资料", permission: 0 }
        ]
    },
    {
        name: "角色管理",
        permission: false,
        sub: [
            { name: "角色管理", permission: 0 },
        ]
    },
    {
        name: "二维码",
        permission: false,
        sub: [
            { name: "生成二维码", permission: 0 },
            { name: "扫码统计", permission: 0 },
        ]
    },
    {
        name: "软件版本管理",
        permission: false,
        sub: [
            { name: "版本管理", permission: 0 }
        ]
    },
    {
        name: "审核",
        permission: false,
        sub: [
            { name: "证件审核", permission: 0 },
        ]
    },
    {
        name: "反馈",
        permission: false,
        sub: [
            { name: "用户反馈", permission: 0 },
            { name: "有奖问答", permission: 0 }
        ]
    },
    {
        name: "设置",
        permission: false,
        sub: [
            { name: "支付接口", permission: 0 },
        ]
    },
    {
        name: "操作说明",
        permission: false,
        sub: [
            { name: "操作日志", permission: 0 },
            { name: "说明", permission: 0 }
        ]
    }
];

export const permListsValues = [
    { name: '查看' },
    { name: '编辑' },
    { name: '删除' },
];

export const sysMenuList = [
    {
        name: "人员管理",
        menuIndex: '0',
        permission: 0,
        className: 'el-icon-menu',
        child: [{
            name: "用户列表",
            menuIndex: "userList",
            permission: 0,
        },
        {
            name: "自营护工列表",
            menuIndex: "ssNurseList",
            permission: 0,
        },
        {
            name: "非自营护工列表",
            menuIndex: "nssNurseList",
            permission: 0,
        },
        {
            name: "服务商列表",
            menuIndex: "foremanList",
            permission: 0,
        },
        {
            name: "用户分布",
            menuIndex: "userDistribution",
            permission: 0,
        },
        {
            name: "护工分布",
            menuIndex: "workerDistribution",
            permission: 0,
        }
        ],
    },
    {
        name: "业务数据",
        menuIndex: '0',
        permission: 0,
        className: 'el-icon-s-order',
        child: [
            {
                name: "分账",
                menuIndex: "splitAccount",
                permission: 0,
            },
            {
                name: "分账明细",
                menuIndex: "accountDetails",
                permission: 0,
            },
            {
                name: "新表分账明细",
                menuIndex: "newOrderAcount",
                permission: 0,
            },
            {
                name: "护理类别",
                menuIndex: "nurseType",
                permission: 0,
            },
            {
                name: "订单需求表",
                menuIndex: "needsList",
                permission: 0,
            },
            {
                name: "服务商端订单",
                menuIndex: "orderList",
                permission: 0,
            },
            {
                name: "小程序端订单",
                menuIndex: "robOrder",
                permission: 0,
            },
            {
                name: "结算记录",
                menuIndex: "statement",
                permission: 0,
            },
            {
                name: "退款记录",
                menuIndex: "refund",
                permission: 0,
            },
            {
                name: "广告管理",
                menuIndex: "advertiseList",
                permission: 0,
            }
        ],
    },
    {
        name: "财务管理",
        menuIndex: '0',
        permission: 0,
        className: 'el-icon-s-finance',
        child: [
            {
                name: "开票",
                menuIndex: "invoice",
                permission: 0,
            },
            {
                name: "开票记录",
                menuIndex: "invoiceRecords",
                permission: 0,
            },
            {
                name: "订单续费",
                menuIndex: "renew",
                permission: 0,
            },
            {
                name: "结算单",
                menuIndex: "Fstatement",
                permission: 0,
            },
            {
                name: "退款审核",
                menuIndex: "Frefund",
                permission: 0,
            }, {
                name: "退款授权",
                menuIndex: "Fwarrant",
                permission: 0,
            },
            {
                name: "收支明细",
                menuIndex: "incomeDetails",
                permission: 0,
            },
            {
                name: "优惠券",
                menuIndex: "cash",
                permission: 0,
            },
            {
                name: "优惠券模板",
                menuIndex: "cashModel",
                permission: 0,
            },
        ],
    },
    {
        name: "保险数据",
        menuIndex: '0',
        permission: 0,
        className: 'el-icon-first-aid-kit',
        child: [{
            name: "抢单保险",
            menuIndex: "robInsure",
            permission: 0,
        },
        {
            name: "服务商单保险",
            menuIndex: "foremanInsure",
            permission: 0,
        },
        {
            name: "保险记录",
            menuIndex: "insureDataInput",
            permission: 0,
        },
            // {
            //     name: "保险过滤",
            //     menuIndex: "insureFliter",
            //     permission: 0,
            // },
        ],
    },
    {
        name: "官网维护",
        menuIndex: '0',
        permission: 0,
        className: 'el-icon-s-cooperation',
        child: [{
            name: "新闻",
            menuIndex: "officenews",
            permission: 0,
        },
        // {
        //     name: "简介",
        //     menuIndex: "officeIntroduction",
        //     permission: 0,
        // },
        {
            name: "客户留言",
            menuIndex: "officeFeedback",
            permission: 0,
        },
        ],
    },
    {
        name: "管理员",
        menuIndex: '0',
        permission: 0,
        className: 'el-icon-s-custom',
        child: [
            {
                name: "管理员管理",
                menuIndex: "adminList",
                permission: 0,
            }, {
                name: "管理员资料",
                menuIndex: "mine",
                permission: 0,
            },],
    },
    {
        name: "角色管理",
        menuIndex: '0',
        permission: 0,
        className: 'el-icon-user-solid',
        child: [
            {
                name: "角色管理",
                menuIndex: "roleManage",
                permission: 0,
            },],
    },
    {
        name: "二维码",
        menuIndex: '0',
        permission: 0,
        className: 'el-icon-s-operation',
        child: [
            {
                name: "生成二维码",
                menuIndex: "QRcode",
                permission: 0,
            },
            {
                name: "扫码统计",
                menuIndex: "scanInfo",
                permission: 0,
            },
        ],
    },
    {
        name: "软件版本管理",
        menuIndex: '0',
        permission: 0,
        className: 'el-icon-share',
        child: [{
            name: "软件版本",
            menuIndex: "softVersion",
            permission: 0,
        }],
    },
    {
        name: "审核",
        menuIndex: '0',
        permission: 0,
        className: 'el-icon-s-check',
        child: [{
            name: "证件审核",
            menuIndex: "certificate",
            permission: 0,
        },],
    },
    {
        name: "反馈",
        menuIndex: '0',
        permission: 0,
        className: 'el-icon-s-comment',
        child: [{
            name: "用户反馈",
            menuIndex: "feekBack",
            permission: 0,
        },
        {
            name: "有奖问答",
            menuIndex: "questionnaire",
            permission: 0,
        },],
    },
    {
        name: "设置",
        menuIndex: '0',
        permission: 0,
        className: 'el-icon-s-tools',
        child: [
            {
                name: "支付接口",
                menuIndex: "alipayInterface",
                permission: 0,
            },
        ],
    },
    {
        name: "操作说明",
        menuIndex: '0',
        permission: 0,
        className: 'el-icon-s-management',
        child: [{
            name: "操作日志",
            menuIndex: "operationLog",
            permission: 0,
        }, {
            name: "说明",
            menuIndex: "explain",
            permission: 0,
        }],
    },

];

export function getPermission(name) {
    // if (this.$store.getters.getIsAdmin)
    //     return 7;

    // let findSubRet = this.$store.getters.getManagerPermission.find(v => v.name === name);
    // if (findSubRet != "undefined") {
    //     // 查找到
    //     return findSubRet.permission;
    // }
    // return 0;
};