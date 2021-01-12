const prices = document.querySelectorAll('.price-format')

const convertToPrice = str => {
    const price = Number(str.textContent).toLocaleString('us-US', {
        style: 'currency', 
        currency: 'USD'
    })

    str.textContent = price
}

prices.forEach(price => convertToPrice(price))


const dates = document.querySelectorAll('.date-format')

const formatDate = date => {
    const orderDate = new Date(date.textContent)
    const formattedDate = orderDate.getDate() + '.' + orderDate.getMonth() + '.' + orderDate.getFullYear()
    date.textContent = formattedDate
}

dates.forEach(date => formatDate(date))