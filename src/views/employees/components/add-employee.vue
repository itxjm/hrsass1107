<template>
  <el-dialog title="新增员工" :visible="isShow" width="50%" @close="onClose">
    <el-form ref="clearFrom" label-width="120px" :model="staffForm" :rules="rules">
      <el-form-item prop="username" label="姓名">
        <el-input v-model="staffForm.username" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item prop="mobile" label="手机号">
        <el-input v-model="staffForm.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item prop="timeOfEntry" label="入职时间">
        <el-date-picker
          v-model="staffForm.timeOfEntry"
          type="datetime"
          placeholder="选择入职时间"
          align="right"
          :picker-options="pickerOptions"
          prefix-icon="el-icon-date"
        />
      </el-form-item>
      <el-form-item prop="formOfEmployment" label="聘用形式" style="width:500">
        <el-select v-model="staffForm.formOfEmployment" placeholder="请选择聘用形式">
          <!-- <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          /> -->
          <el-option
            v-for="item in EmployeesEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="workNumber" label="工号">
        <el-input v-model="staffForm.workNumber" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item prop="departmentName" label="部门">
        <el-input v-model="staffForm.departmentName" placeholder="请选择部门" @focus="getDepartments" />
        <!-- 放置一个树形组件 -->
        <el-tree v-if="showTree" v-loading="loading" :data="treeData" :props="{label:'name'}" default-expand-all @node-click="selectNode" />
      </el-form-item>
      <el-form-item prop="correctionTime" label="转正时间">
        <el-date-picker
          v-model="staffForm.correctionTime"
          type="datetime"
          placeholder="选择转正时间"
          align="right"
          :picker-options="pickerOptions"
          prefix-icon="el-icon-date"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button type="info" size="small" @click="onClose">取消</el-button>
          <el-button type="primary" size="small" @click="onConfirm">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import { addEmployeeList } from '@/api/employees'
import EmployeesEnum from '@/api/constant/employees'

export default {
  name: 'HrsaasAddEmployee',
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeesEnum,
      staffForm: {
        username: '',
        mobile: '',
        timeOfEntry: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        correctionTime: ''
      },
      value: '',
      // value2: '',
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { min: 2, max: 4, message: '名字在2-4个字符之间', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        timeOfEntry: [
          { required: true, message: '入职时间不能为空', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ]
      },
      treeData: [], // 定义一个数组来接收树形结构
      showTree: false, // 默认不显示tree
      loading: false,
      // options: [{// value: '选项1',label: '正式'},{// value: '选项2',label: '非正式'}],
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
      }
    }
  },

  mounted() {

  },

  methods: {
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      // depts是一个数组 他需要转化成树形结构 才可以被el-tree显示
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    async onClose() {
      this.staffForm = {
        username: '',
        mobile: '',
        timeOfEntry: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        correctionTime: ''
      }
      await this.$refs.clearFrom.resetFields()
      this.$emit('update:isShow')
    },
    async onConfirm() {
      try {
        await this.$refs.clearFrom.validate()
        await addEmployeeList(this.staffForm) // 调用新增接口
        // 通知父组件 更新数据
        // this.$parent父组件实例(用的较少)
        // console.log(this.$parent)
        this.$parent.getEmployeeList && this.$parent.getEmployeeList() // 直接调用父组件的更新方法
        this.$parent.isShow = false
        this.onClose()
      } catch (error) {
        console.log(error)
      }
    },
    selectNode(node) {
      // console.log(arguments)
      this.staffForm.departmentName = node.name
      this.showTree = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item{
  .el-input{
  width: 50%;
  }
  .el-date-picker{
    width: 50%;
  }
  .el-select{
    width: 50%;
  }
}
</style>
