<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div
            style="
              height: 150px;
              background-size: cover;
              background-position: center;
            "
            :style="{ backgroundImage: `url(${item.imageUrl})` }"
          ></div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{
              item.category
            }}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{ item.description }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <!-- <div class="h5">2,800 元</div> -->
              <del class="h6">原價{{ item.origin_price | currency }}元</del>
              <div class="h5">現在只要{{ item.price | currency }}元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click="productInfo(item.id)"
            >
              <i
                class="fas fa-spinner fa-spin"
                v-if="status.loadingItem === item.id"
              ></i>
              查看更多
            </button>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm ml-auto"
              @click="addtoCart(item.id)"
            >
              <i
                class="fas fa-spinner fa-spin"
                v-if="status.loadingCart === item.id"
              ></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="singleProductModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              {{ singleProduct.title }}
            </h5>
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
            <img :src="singleProduct.imageUrl" class="img-fluid" alt="" />
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ singleProduct.content }}</p>
              <footer class="blockquote-footer text-right">
                {{ singleProduct.description }}
              </footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!singleProduct.price">
                {{ singleProduct.origin_price }} 元
              </div>
              <del class="h6" v-if="singleProduct.price"
                >原價 {{ singleProduct.origin_price }} 元</del
              >
              <div class="h4" v-if="singleProduct.price">
                現在只要 {{ singleProduct.price }} 元
              </div>
            </div>
            <select
              name=""
              class="form-control mt-3"
              v-model="singleProduct.num"
            >
              <option :value="num" v-for="num in 10" :key="num">
                選購 {{ num }} {{ singleProduct.unit }}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計
              <strong>{{ singleProduct.num * singleProduct.price }}</strong> 元
            </div>
            <button
              type="button"
              class="btn btn-primary"
              @click="addtoCart(singleProduct.id, singleProduct.num)"
            >
              <i
                class="fas fa-spinner fa-spin"
                v-if="singleProduct.id === status.loadingCart"
              ></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal2 -->
    <div
      class="modal fade"
      id="ruSure"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="ruSure">注意！！！</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">歐低，確定要刪除嗎？</div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
              @click="sureOrnot=false"
            >
              還是算惹
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="sureOrnot=true"
            >
              我不要了
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-center my-5">
      <div class="col-md-6">
        <table class="table mt-4">
          <thead>
            <tr>
              <th>品名</th>
              <th>數量</th>
              <th>單價</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in mycartFinal" :key="item.id">
              <td>{{ item.el }}</td>
              <td class="text-center">
                {{ item.Num }}
              </td>
              <td class="text-center">
                {{ item.Money | currency }}
              </td>
              <td class="text-right">
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="openModal(item.Id)"
                >
                  <i class="far fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right"><h2>總計</h2></td>
              <td class="text-center">
                <h2>{{ totalCost }}元</h2>
              </td>
            </tr>
            <!-- <tr v-if="cart.final_total !== cart.total">
              <td colspan="3" class="text-right text-success">折扣價</td>
              <td class="text-right text-success">{{ cart.final_total }}</td>
            </tr> -->
          </tfoot>
        </table>
        <div class="input-group mb-3 input-group-sm">
          <input
            type="text"
            class="form-control"
            v-model="coupon_code"
            placeholder="請輸入優惠碼"
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="addCouponCode"
            >
              套用優惠碼
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
      products: [],
      singleProduct: {},
      myCart: [],
      mycartFinal: [],
      totalCost: 0,
      status: {
        loadingItem: "",
        loadingCart: "",
      },
      isLoading: false,
      coupon_code: "",
      sureOrnot: false,
    };
  },
  methods: {
    getProducts(page = 1) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/all`;
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        console.log("這是Product取得的", response.data);
        vm.products = response.data.products;
        vm.isLoading = false;
      });
    },
    productInfo(id) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
      vm.status.loadingItem = id;
      this.$http.get(api).then((response) => {
        console.log("這是ProductInfo取得的", response.data);
        vm.singleProduct = response.data.product;
        $("#singleProductModal").modal("show");
        vm.status.loadingItem = "";
      });
    },
    addtoCart(id, qty = 1) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const cart = {
        product_id: id,
        qty,
      };
      vm.status.loadingCart = id;
      this.$http.post(api, { data: cart }).then((response) => {
        console.log("這是addtoCart取得的", response.data);
        if (response.data.message === "已加入購物車") {
          alert("成功加入購物車");
        }
        vm.status.loadingCart = "";
        vm.mycartFinal = [];
        vm.totalCost = 0;
        vm.getCart();
        $("#singleProductModal").modal("hide");
      });
    },
    getCart() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        console.log("這是getCart行為", response.data);
        vm.myCart = response.data.data.carts;
        vm.myCart.sort((a, b) => {
          return a.product.price - b.product.price;
        });
        vm.isLoading = false;
        vm.cartInfo();
      });
    },

    cartInfo() {
      const vm = this;
      let allcartProduct = [];
      vm.myCart.forEach((el) => {
        allcartProduct.push(el.product.title);
      });
      let productinCart = allcartProduct.filter((el, index, arr) => {
        return arr.indexOf(el) === index;
      });
      console.log(allcartProduct);
      console.log(productinCart);
      productinCart.forEach((el) => {
        let Num = 0;
        let Money = 0;
        let Id = "";
        vm.myCart.forEach((item) => {
          if (el === item.product.title) {
            Money += item.final_total;
            Num += item.qty;
            Id = item.id;
            vm.totalCost += item.final_total;
          }
        });
        vm.mycartFinal.push({
          el,
          Money,
          Num,
          Id,
        });
      });
      // console.log(cartTotal)
    },

    removeCartItem(id) {
      const vm = this;
      const coupon = {
        code: vm.coupon_code,
      };
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      // vm.isLoading = true;
      this.$http.delete(api, { data: coupon }).then((response) => {
        console.log("這是removeCart行為", response.data);
        vm.mycartFinal = [];
        vm.totalCost = 0;
        // vm.myCart = response.data.data.carts;
        // vm.myCart.sort((a, b) => {
        //   return a.product.price - b.product.price;
        // });
        // vm.isLoading = false;
        vm.getCart();
      });
    },
    openModal(id) {
      $("#ruSure").modal("show");
      if (this.sureOrnot) {
        this.removeCartItem(id);
        $("#ruSure").modal("hide");
      } else {
        $("#ruSure").modal("hide");
      }
    },
    addCouponCode() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      // vm.isLoading = true;
      this.$http.delete(api).then((response) => {
        console.log("這是removeCart行為", response.data);
        vm.mycartFinal = [];
        vm.totalCost = 0;
        vm.getCart();
      });
    },
  },
  created() {
    this.getProducts();
    this.getCart();
  },
};
</script>

