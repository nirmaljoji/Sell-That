function insertAnswer(id,answer){
    fetch('/answer', { method: 'POST', data: {id:id , answer:answer} })
      .then(function (response) {
        if (response.ok) {
          console.log('answer sent to node')
          return
        }
        throw new Error('Request failed.')
      })
      .catch(function (error) {
        console.log(error)
      })
    }