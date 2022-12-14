<template>
  <div>
    <!-- 放置弹层组件 -->
    <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
      <!-- 表单数据label-width设置所有标题的宽度 -->
      <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="部门名称">
          <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item prop="code" label="部门编码">
          <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item prop="manager" label="部门负责人">
          <!-- el-select对外开放focus事件所以native可写可不写 -->
          <!-- native修饰符 可以找到原生元素的事件 -->
          <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
            <!-- 遍历选项 -->
            <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
          </el-select>
        </el-form-item>
        <el-form-item prop="introduce" label="部门介绍">
          <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :row="3" />
        </el-form-item>
      </el-form>
      <!-- 确定和取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'HrsaasAddDept',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },

  data() {
    // 检查部门名称是否重复
    const checkNameRepet = async(rule, value, callback) => {
      // value是部门名称 要去和同级部门下的部门去比较  有相同的不可以过 没有相同的可以过
      const { depts } = await getDepartments()
      // 去找同级部门下 有没有和value相同的数据
      // 找到同级部门的所有子部门
      let isRepeat = false
      if (this.formData.id) {
        // 有id就是编辑模式
        // 编辑的数据 在数据库里有  同级部门下 我的名字不能和其他同级部门名字重复
        // 同级部门 => this.formData.id就是我当前的id 我的pid是this.formData.pid
        // depts.filter(item => item.pid === this.formData.pid) 找到所有和我同级部门数据
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value) // treeNode当前点击的节点
      } else {
        // 没有id就是新增模式
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      // 如果isRepeat为true 表示找到了一样的名字
      isRepeat ? callback(new Error(`同级部门下已经存在这个${value}部门了`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式
        // 不能有一样的code
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        // 新增模式
        isRepeat = depts.some(item => item.code === value && value)
      }
      // 要求编码和所有部门编码都不能重复
      // 由于历史数据有可能没有code 可以加一个强制性条件  value值不为空
      isRepeat ? callback(new Error(`组织架构中已经存在这个${value}编码了`)) : callback()
    }
    return {
      // 定义一个表单数据
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepet }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码长度为1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: checkCodeRepeat
          }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门介绍长度为1-300个字符', trigger: 'blur' }]
      }, // 校验规则{key：数组}
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },

  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 获取详情的的方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    },
    // 点击确定 手动校验表单
    btnOK() {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          if (this.formData.id) {
            // 编辑模式 调用编辑接口
            // debugger
            await updateDepartments(this.formData)
          } else {
            // 新增模式  调用新增接口 添加父部门的id
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          // 表单校验通过
          this.$emit('addDepts') // 触发一个自定义事件
          // update:props名称，值
          this.$emit('update:showDialog', false)
        }
      })
    },
    btnCancel() {
      // 重置数据 因为el-form中 resetFields 不能重置非表单数据 所以只能在取消的位置强制加数据
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 关闭弹出
      this.$emit('update:showDialog', false)
      // 清除之前的校验
      this.$refs.deptForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
