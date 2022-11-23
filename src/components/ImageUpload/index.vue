<template>
  <div>
    <!-- file-list是长传的文件列表 可以绑定到上传组件尖上 让上传组件来显示 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :file-list="fileList"
      :class="{ disabled:fileComputed }"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" :percentage="percent" style="width:180px" />
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgURL" alt="" style="width:100%">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云cos包
// 实例化cos对象
const cos = new COS({
  SecretId: 'AKIDPispZ8WhfOtAML7UdZGm47ye7MMCsLYX', // 身份识别id
  SecretKey: 'qSpyvfBYjgPvHTRClHbjdJlEWbS4TfcL' // 身份秘钥
})
export default {
  name: 'HrsaasIndex',

  data() {
    return {
      fileList: [],
      showDialog: false,
      imgURL: '',
      currentFileUid: null, // 记录当前正在上传的uid
      percent: 0, // 记录进度条
      showPercent: false
    }
  },

  // 定义一个计算属性 判断是否上传完成
  //  如果为true 表示不应该显示 + 号
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },

  methods: {
    // 点击预览事件
    preview(file) {
      console.log(file.url)
      this.imgURL = file.url
      this.showDialog = true
    },
    // file 是要删除的文件
    // fileList 是删除过后的文件
    handleRemove(file, fileList) {
      // console.log(file)
      // console.log(fileList)
      // console.log(this.fileList)
      this.fileList = this.fileList.filter(item => item.uid !== file.uid) // 将当前的 删除文件排除在外
    },
    changeFile(file, fileList) {
      // console.log(file)
      // console.log(fileList.length)
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      // console.log(file)
      // 先检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/webp', 'image/png', 'image/bmp']
      if (!types.some(item => item === file.type)) {
        // 如果不存在
        this.$message.error('上传图片只能是 JPEG GIF WEBP PNG BMP格式!')
        return false // 上传终止
      }
      // 检查文件大小
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        //  超过限制大小
        this.$message.error('上传的图片大小不能超过5M')
        return false
      }
      //  已经确定当前上传的就是当前的file了
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
    },
    upload(params) {
      console.log(params.file)
      // 执行上传操作
      if (params.file) {
        cos.putObject({
          Bucket: 'jasmine-1315196397', // 存储桶
          Region: 'ap-nanjing', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认标准模式即可
          onProgress: (params) => {
            // console.log(params)
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          //  data返回数据之后
          console.log(err || data)
          // data中有一个statusCode === 200 的时候说明上传成功
          if (!err && data.statusCode === 200) {
            //  此时说明文件上传成功 要获取成功的返回案例
            // fileList 是一个数组 需要知道当前上传成功的是哪一张图片
            this.fileList = this.fileList.map(item => {
              //  去找谁的UID等于公共记录下俩的id
              if (item.uid === this.currentFileUid) {
                //  将成功的地址赋值给原来的URL属性
                return { url: 'http://' + data.Location, upload: true }
                //  upload: true 表示这会在哪个图片已经上传完毕 这个属性要为我们后期应用的时候做标记
              }
              return item
            })
            // 关闭进度条
            // 重置百分比
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 1000)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.disabled .el-upload--picture-card{
  display: none;
}
</style>
