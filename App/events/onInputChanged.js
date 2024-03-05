const onInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
}

export default [onInputChange];