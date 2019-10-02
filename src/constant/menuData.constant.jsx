const menuData = [
    {
        key:'production',
        icon: 'home',
        link: '',
        text:'商品管理',
        children: [
            {
                key:'goods_list',
                icon:'home',
                link:'goods_list',
                text:'商品列表'
            },
            {
                key:'goods_edit',
                icon:'home',
                link:'goods_edit',
                text:'编辑商品'
            }
        ]
    },
    {
        key:'config',
        icon: 'home',
        link: '',
        text:'配置',
        children: [
            {
                key:'project_config',
                icon:'home',
                link:'project_config',
                text:'项目配置'
            },
            {
                key:'column_config',
                icon:'home',
                link:'column_config',
                text:'专栏配置' 
            },
            {
                key:'activite_config',
                icon:'home',
                link:'activite_config',
                text:'商品活动配置' 
            },
            {
                key:'recommend_config',
                icon:'home',
                link:'recommend_config',
                text:'商品推荐位配置' 
            }
        ]
    },
    {
        key:'order',
        icon: 'home',
        link: 'order',
        text:'订单管理'
    }
]

export default menuData