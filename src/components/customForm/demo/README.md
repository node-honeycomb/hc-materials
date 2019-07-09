---
title: customForm
publishDate: 2018-11-11
---

### customform

#### 概括

根据表单配置项来自动生成表单的组件

#### API
customform

成员 | 说明 | 类型 | 默认值 
:-: | :-: | :-: | :-:
className | 每个表单组件的类名| string | - 
style | 表单组件的样式 | object | - 
dataSource | 每个表单项的默认值 | object | null 
parentDataSource | 如若表单被嵌套提供的每个表单项的默认值 | object | null
options | 表单配置项 | array | - 
formLayout | 表单的布局 | string or array | - 
rules | 表单项的规则配置 | array | -
onSubmit | 表单的提交事件 | func | -
onChange |  | func | -
layout | form表单的布局 | bool | -
buttons | 表单按钮 | object | -
name |  | object | -
title | card卡片的title | string | -
noLabel | 设置是否展示表单的label | bool | -
noFlattern | 是否存在嵌套 | bool | -
normalize |  | bool | -
loading | 控制是否把输入框默认值转化为表单的默认值 | object | -
keep |  | bool | -
compact | 控制表单项样式 | bool | -
disabled | 控制表单项是否可操作 | bool | -