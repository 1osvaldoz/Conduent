import React from 'react'
 

class weather extends React.Component {

  constructor(props) {
    super(props)
    this.state = { clima: [] }
  }

  componentWillMount() {

    fetch('http://samples.openweathermap.org/data/2.5/weather?id=4004898&appid=d1235d1d11c7bc874a1a70bbf1dfc84a',
    { mode: "no-cors",
      method: 'get',
      headers: {
        'Content-Type': 'application/json'       
      }})
 
      .then((response) => {
        this.setState({ clima: response  })
        
      })
      .then((recurso) => {
        console.log(recurso)
      })
  }

  render() {
  
      return (
        <div className="container-fluid">
           {console.log(this.state.clima)}  
        </div>
      )
     
  }

}

export default weather
