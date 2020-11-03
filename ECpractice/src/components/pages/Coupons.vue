<template>
  <div>
    <div class="mt-4 text-right">
      <button
        type="button"
        class="btn btn-primary text-right"
        @click="openModal(true)"
      >
        建立新的優惠卷
      </button>
    </div>

    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in coupons" :key="key">
          <td>{{ item.title }}</td>
          <td>{{ item.percent }}%</td>
          <td>{{ item.due_date | date }}</td>
          <td><span v-if="item.is_enabled === 1" class="text-success">啟用</span>
            <span v-else class="text-muted">未起用</span></td>
          <td> <button class="btn btn-outline-primary btn-sm"
              @click="openModal(false, item)"
            >編輯</button></td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div
      class="modal fade"
      id="couponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">優惠卷內容</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="title">標題</label>
              <input
                type="text"
                id="title"
                class="form-control"
                v-model="tempCoupon.title"
                placehold="請輸入標題"
              />
            </div>
            <div class="form-group">
              <label for="coupon_code">優惠碼</label>
              <input
                type="text"
                id="coupon_code"
                class="form-control"
                v-model="tempCoupon.code"
                placehold="請輸入優惠碼"
              />
            </div>
            <div class="form-group">
              <label for="due_date">到期日</label>
              <input
                type="date"
                name=""
                id="due_date"
                class="form-control"
                v-model="due_date"
              />
            </div>
            <div class="form-group">
              <label for="due_date">折扣百分比</label>
              <input
                type="number"
                name=""
                id="price"
                class="form-control"
                v-model="tempCoupon.percent"
                placehold="請輸入折扣百分比"
              />
            </div>
            <div class="form-group">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :true-value="1"
                  :false-value="0"
                  v-model="tempCoupon.is_enabled"
                  id="is_enabled"
                />
                <label class="form-check-label" for="is_enabled">
                  是否啟用
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="updateCoupon"
            >
              更新優惠券
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  data() {
    return {
      tempCoupon:{
        title:'',
        is_enabled:0,
        percent:100,
        due_date:0,
        code:'',
      },
      coupons:[],
      due_date:new Date(),
      isNew:false,
    };
    
  },
  watch:{
  due_date(){
  const vm = this;
  const timestamp = Math.floor(new Date(vm.due_date)/1000)
  vm.tempCoupon.due_date = timestamp
}
  },
  methods: {
    openModal(isNew, item){
      $('#couponModal').modal('show')
      if(isNew){
      this.tempCoupon = {}
      }else{
        this.tempCoupon = Object.assign({}, item)
        const dateAndTime = new Date(this.tempCoupon.due_date * 1000).toISOString().split('T');
	      this.due_date = dateAndTime[0];
      }
      
  },
    getCoupons(page=1){
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
        this.$http.get(api).then((response) => {
        console.log("這是Coupon取得的", response.data.coupons);
        vm.coupons = response.data.coupons;
        // vm.isLoading = false;
        // vm.pagination = response.data.pagination;
      });
  },
    updateCoupon(){
      const vm = this;
      let httpMethod = "post";
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
      if (!vm.isNew) {
        api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
        httpMethod = "put";
      }
      this.$http[httpMethod](api, { data: vm.tempCoupon }).then((response) => {
        if (response.data.success) {
          $("#couponModal").modal("hide");
          vm.getCoupons();
        } else {
          $("#couponModal").modal("hide");
          vm.getCoupons();
          console.log("新增資料失敗");
        }
      });
    }
  },
  created(){
    this.getCoupons()
  }
};
</script>