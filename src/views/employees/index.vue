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
          <el-button size="small" type="danger" @click="$router.push('/import')">Excel导入</el-button>
          <el-button size="small" type="success" @click="exportData">Excel导出</el-button>
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
              <img v-imageerror="defaultImg" :src="row.staffPhoto" class="staff-img" @click="showQr(row.staffPhoto)">
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
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
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
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <!-- <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row> -->
      <el-row type="flex" justify="center">
        <vue-qr
          :text="ops.text"
          :logo-src="ops.logoSrc"
          :binarize="ops.binarize"
          :binarize-threshold="ops.binarizeThreshold"
          :color-dark="ops.colorDark"
          :auto-color="ops.autoColor"
          :size="ops.size"
          :dot-scale="ops.dotScale"
          :bgcale="ops.bgcale"
          :bg-src="ops.bgSrc"
          qid="itxst.com"
        />
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, deleteEmployeeList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import defaultImg from '@/assets/common/bigUserHeader.png'
import AddEmployee from './components/add-employee'
import { formatDate } from '@/filters'
// import QrCode from 'qrcode'
import VueQr from 'vue-qr'

export default {
  name: 'HrsaasIndex',
  components: {
    AddEmployee,
    VueQr
  },

  data() {
    return {
      ops: {
        // 二维码内容
        text: 'http://www.itxst.com',
        // logo图标
        logoSrc: 'http://192.168.2.103:8080/logo.png',
        // autoColor未false,二维码数据点的颜色
        colorDark: '#007bff',
        // 二维码数据点的速率比，默认未0.35
        dotScale: 0.6,
        // 背景图的速率比
        bgcale: 0.8,
        // 二维码背景图
        bgSrc: 'http://192.168.2.103:8080/bg0.png',
        // 二维码数据点的颜色是否自动生成颜色
        autoColor: true,
        // 二值化
        binarize: false,
        // 二值化值
        binarizeThreshold: 130
      },
      showCodeDialog: false,
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
    // 点击头像弹出二维码
    async showQr(url) {
      console.log(url)
      if (url) {
        this.showCodeDialog = true
        // 我们要等数据更新完成在显示二维码
        await this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          // QrCode.toCanvas(this.$refs.myCanvas, url)
          // console.log(this.$refs.myCanvas)
          // console.log(QrCode)
          // debugger
          this.ops = {
            text: url,
            logoSrc: url,
            bgSrc: url,
            // autoColor未false,二维码数据点的颜色
            colorDark: '#007bff',
            // 二维码数据点的速率比，默认未0.35
            dotScale: 0.6,
            // 背景图的速率比
            bgcale: 0.8,
            // 二维码数据点的颜色是否自动生成颜色
            autoColor: true,
            // 二值化
            binarize: false,
            // 二值化值
            binarizeThreshold: 130
          }
        })
        // 让弹窗打开
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    // async showQrCode(url) {
    //   // url 存在的情况下 才弹出层
    //   if (url) {
    //     this.showCodeDialog = true
    //     await this.$nextTick(() => {
    //       //  此时可以确定已经有ref对象了
    //       QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
    //     })
    //   } else {
    //     this.$message.warning('该用户还未上传头像')
    //   }
    // },
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
    },
    exportData() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 导出Excel
      import('@/vendor/Export2Excel').then(async excel => {
        // excel是引入文件的导出对象
        //  获取员工的接口 页码 每页条数
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJSON(headers, rows) // 返回的data就是要导出的结构
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          // header: ['姓名', '工资'],
          // data: [['张三', 2222], ['李四', 333]],
          // filename: '员工工资表'
          header: Object.keys(headers),
          // data: data
          data,
          filename: '员工资料表',
          multiHeader, // 复杂表头
          merges // 合并选项
        })
      })
    },
    // 将表头数据和数据进行对应
    formatJSON(headers, rows) {
      return rows.map(item => {
        // item是一个对象
        return Object.keys(headers).map(key => {
          // 需要判断字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
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
