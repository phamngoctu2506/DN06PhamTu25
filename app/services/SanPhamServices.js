function SanPhamServices(){
    this.url = "https://63676ecaf5f549f052d54efc.mockapi.io";
    
    this.danhSachSP = function(){
        return axios({
            method: 'get',
            url: `${this.url}/danhsachsp`,
          })
    }
}