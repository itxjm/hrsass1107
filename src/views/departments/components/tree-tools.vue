<template>
  <el-row type="flex" justify="space-between" align="middle" style="height:40px; width:100%">
    <el-col>
      <!-- 左侧内容 -->
      <span>{{ treeNode.name }}</span>
    </el-col>

    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="delete">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      <!--右侧内容-->
    </el-col>

  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  name: 'HrsaasTreeTools',
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {

    }
  },

  methods: {
    operateDepts(type) {
      if (type === 'add') {
        // 添加子部门
        // 在当前点击的部门下 添加子部门 => this.treeNode 就是当前点击的部门
        this.$emit('addDepts', this.treeNode)
      } else if (type === 'edit') {
        // 编辑部门
        this.$emit('editDepts', this.treeNode)
      } else {
        // 删除部门
        // alert('删除')
        this.$confirm('您确定删除?').then(() => {
          return delDepartments(this.treeNode.id)
        }).then(() => {
          // 只需要等到成功的时候 调用接口删除 后端数据变化了 但前端没变
          this.$emit('delDepts') // 触发自定义事件
          this.$message.success('删除成功')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
