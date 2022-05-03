// Selecting Elements
const search = document.querySelector('#search');
const currentPage = document.querySelector('.current-page');
const totalPage = document.querySelector('.total-page');
const totalRow = document.querySelector('#total-row');
const table = document.querySelector("table");
const noResult = document.querySelector("tbody");
const pagination = document.querySelector(".pagination");
const ctyPerPage = document.querySelector("#city-per-page");

let qString="del";
let data;
let dataLength ;
let count = 0;
let total=0 ;
let current=1;
let inc=3;

//  Fetching Data
const getData = async (qString, limit) => {
  let dataMain;
  var options = {
    method: 'GET',
    url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
    params: { namePrefix: `${qString}`, limit: `${limit}` },
    headers: {
      'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
      'x-rapidapi-key': '4ac5e3352fmshe6ac515ca3b8ccap1f0045jsnf0a504a87bbe'
    }
  };

  await axios.request(options).then(function (response) {
    // console.log(response.data);
    dataMain = response.data;
  }).catch(function (error) {
    console.error(error);
  });
  return dataMain;
}



const creatRow = async (qString,num=5) => {
  let response = await getData(qString, num);
  console.log(response.data);
  data = response.data;
  dataLength= data.length;
  total=Math.ceil(dataLength/inc);
  totalPage.textContent= `${total}`;
  showData();
  
}
const showData=()=>{
  const newTbody = document.createElement('tbody');
  const itemsToShow = data.slice(count,count+inc);
  currentPage.textContent=`${current}`;
   if (dataLength !== 0) {
 
     itemsToShow.forEach((elem, idx) => {
       const newTr = document.createElement('tr');

       // newElm.setAttribute('class','show');
       newTr.innerHTML = `
       <td>${count+idx + 1}</td>
       <td>${elem.city}</td>
       <td><img src="https://countryflagsapi.com/png/${elem.countryCode}"/></td>
       `
       newTbody.appendChild(newTr);
     })
   }else{
    const newTr = document.createElement('tr');
    newTr.innerHTML = `
    <td colspan="3">No Data Found</td>
    `
    newTbody.appendChild(newTr);
   }
 
  //  console.log(response);
   table.removeChild(table.lastElementChild);
   table.appendChild(newTbody);
}



const changeNoOfResults = (e) => {
  // console.log(e.which);
  if (e.which === 13) {
    const val = parseInt(e.target.value);
    if (val > 10) {
      alert("Number Cannot Be More than 10")
    } else {

      creatRow(qString, val);

    }
    e.target.value = "";
  }

}
const handleSearch=(e)=>{
  if (e.which === 13) {
    qString = e.target.value;
    creatRow(qString);
    e.target.value = "";
  }
  
}


const incDecCount=(e)=>{
  if(e.target.classList.contains('prev')){
    if(count>=0 &&current>1){
      current-=1;
      count-=3;
      showData();
    }else{
      // disable
    }
  }else if(e.target.classList.contains('next')){
    if(count<=dataLength && current<total){
      count+=3;
      current+=1;
      showData();
    }else{
    // Disable button
    }
  }

}
const changeNoOfRow = (e) => {
  // console.log(e.which);
  if (e.which === 13) {
    inc = parseInt(e.target.value);
      count = 0;
      total=0 ;
      current=1;
      creatRow(qString);

    e.target.value = "";
  }

}

// Read the Input number from user

search.addEventListener('keydown', handleSearch);
totalRow.addEventListener('keydown', changeNoOfResults);
pagination.addEventListener("click",incDecCount);
ctyPerPage.addEventListener('keydown',changeNoOfRow);