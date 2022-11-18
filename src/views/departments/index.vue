<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <el-tree
          :data="departs"
          :props="defaultProps"
          default-expand-all
        >
          <tree-tools slot-scope="{data}" :tree-node="data" @addDepts="addDepts" @delDepts="getDepartments" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增弹层组件 -->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import AddDept from './components/add-dept'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'HrsaasIndex',
  components: {
    TreeTools,
    AddDept
  },

  data() {
    return {
      company: {}, // 头部的数据结构
      departs: [],
      defaultProps: {
        label: 'name'
      },
      showDialog: false, // 默认不显示弹层
      node: null// 记录当前点击的node节点
    }
  },

  mounted() {
    this.getDepartments() // 调用自身方法
  },

  methods: {
    // 定义一个方法(和接口名一样的的方法) 重新拉取数据的方法
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }// depts是所有的数组
      this.departs = tranListToTreeData(result.depts, '') // 需要将其转换成树形结构
      console.log(result)
    },
    // 监听tree-tools中触发的点击添加子部门的事件
    addDepts(node) {
      this.showDialog = true
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true
      this.node = node
      // console.log(this.$refs.adddept)
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-card{
  padding: 30px 140px;
  font-size: 14px;
}

</style>
