<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 左侧显示总记录数 -->
        <template #before>
          <span slot="before">共{{ page.total }}条记录</span>
        </template>
        <!-- 右侧显示按钮 -->
        <template #after>
          <el-button size="small" type="danger">Excel导入</el-button>
          <el-button size="small" type="success">Excel导出</el-button>
          <el-button size="small" type="primary" @click="isShow=true">新增员工</el-button>
        </template>
      </page-tools>
      <el-card v-loading="loading">
        <!-- 表格组件 -->
        <el-table border :data="list">
          <el-table-column type="index" label="序号" width="80" sortable />
          <el-table-column label="姓名" prop="username" sortable />
          <el-table-column label="头像" prop="staffPhoto" sortable>
            <template v-slot="{row}">
              <img v-imageerror="defaultImg" :src="row.staffPhoto" class="staff-img">
            </template>
          </el-table-column>
          <el-table-column label="工号" prop="workNumber" sortable />
          <el-table-column label="聘用形式" :formatter="formatterEmployment" prop="formOfEmployment" sortable />
          <el-table-column label="部门" prop="departmentName" sortable />
          <el-table-column label="入职时间" prop="timeOfEntry" sortable>
            <template v-slot="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" prop="enableState" sortable>
            <template v-slot="{row}">
              <el-switch active-color="red" :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="enableState" sortable fixed="right" width="280">
            <template v-slot="{row}">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 放置分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height:60px">
          <!-- <el-pagination
            layout="prev,pager,next"
            :current-page="page.page"
            :page-size="page.size"
            :total="page.total"
            @current-change="currentChange"
          /> -->
          <el-pagination
            :current-page="page.page"
            :page-sizes="[5, 10, 15, 30]"
            :page-size="page.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>

    </div>
    <!-- 新增员工的弹层 -->
    <add-employee :is-show.sync="isShow" />
  </div>
</template>

<script>
import { getEmployeeList, deleteEmployeeList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import defaultImg from '@/assets/common/bigUserHeader.png'
import AddEmployee from './components/add-employee'

export default {
  name: 'HrsaasIndex',
  components: {
    AddEmployee
  },

  data() {
    return {
      isShow: false,
      defaultImg,
      list: [], // 接收数组
      page: {
        page: 1,
        size: 5,
        total: 0
      },
      loading: false
    }
  },

  mounted() {
    this.getEmployeeList()
  },

  methods: {
    handleSizeChange(newSize) {
      this.page.size = newSize
      this.getEmployeeList()
    },
    handleCurrentChange(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      rows.forEach(item => {
        item.enableState = 1
      })
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    formatterEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工信息
    async delEmployee(id) {
      try {
        await this.$confirm('您确认删除?')
        await deleteEmployeeList(id)
        this.$message.success('删除成功')
        this.getEmployeeList()
      } catch (error) {
        console.log(error)

        this.$message.info('您取消了操作')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table{
  .el-table-column{
    text-align: center;
  }
}
.staff-img{
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
</style>
