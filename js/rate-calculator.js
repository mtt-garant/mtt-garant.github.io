
// Метод для получения курса 1 MTT за USDT и обратного курса
function calculateMttForUsdt() {
  return fetch('http://95.111.203.22:8090/api/v1/rates/sellerMttForUsdt')
    .then(response => response.json())
    .then(data => {
      // Возвращаем объект с курсами
      return {
        mttPrice: data.mttPrice, // Курс 1 MTT за USDT
        usdtPrice: data.usdtPrice // Курс 1 USDT за MTT
      };
    })
    .catch(error => {
      console.error('Error fetching rates:', error);
      return {
        mttPrice: 'N/A',
        usdtPrice: 'N/A'
      };
    });
}

function calculateMttForBnb() {
  return fetch('http://95.111.203.22:8090/api/v1/rates/sellerMttForBnb')
    .then(response => response.json())
    .then(data => {
      // Возвращаем объект с курсами
      return {
        mttPrice: data.mttPrice, // Курс 1 MTT за USDT
        bnbPrice: data.bnbPrice // Курс 1 USDT за MTT
      };
    })
    .catch(error => {
      console.error('Error fetching rates:', error);
      return {
        mttPrice: 'N/A',
        bnbPrice: 'N/A'
      };
    });
}