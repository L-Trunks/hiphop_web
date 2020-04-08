<template>
  <div>
    <div id="allmap"></div>
  </div>
</template>

<script>
export default {
  name: "BaiduMap",
  data() {
    return {
      address: ""
    };
  },
  created() {
    this.address = this.$route.query.address;
  },
  mounted() {
    this.getLocation(this.address);
  },
  methods: {
    getLocation(address) {
      // 百度地图API功能
      var map = new BMap.Map("allmap");
      var point = new BMap.Point(116.331398, 39.897445);
      map.centerAndZoom(point, 12);
      // 创建地址解析器实例
      var myGeo = new BMap.Geocoder();
      // 将地址解析结果显示在地图上,并调整地图视野
      myGeo.getPoint(
        address || "辽宁省大连市甘井子区大连东软信息学院",
        function(point) {
          if (point) {
            map.centerAndZoom(point, 16);
            map.addOverlay(new BMap.Marker(point));
          } else {
            alert("地址没有解析到结果!");
          }
        }
      );
    }
  },
  watch: {
    address: {
      handler(newval, old) {
        this.getLocation(newval);
      },
      deep: true
    }
  }
};
</script>

<style scoped>
#allmap {
    position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  font-family: "微软雅黑";
}
</style>