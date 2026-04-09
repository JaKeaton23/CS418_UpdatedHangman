import React from 'react';

// LoginForm - asks the user for their name before the game starts
// When they submit, tells the parent (HangmanApp) the name they entered
class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      error: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ name: event.target.value, error: '' });
  }

  handleSubmit() {
    const trimmed = this.state.name.trim();
    if (trimmed.length === 0) {
      this.setState({ error: 'Please enter a name' });
      return;
    }
    // tell the parent component
    this.props.onLogin(trimmed);
  }

  render() {
    return (
      <div className="login-screen">
        <div className="login-box">
          <h2>Enter Your Name</h2>
          <p className="login-message">
            We will look you up in our records!
          </p>
          <input
            type="text"
            value={this.state.name}
            onChange={this.handleChange}
            placeholder="Your name"
            className="login-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') this.handleSubmit();
            }}
          />
          {this.state.error && <p className="login-error">{this.state.error}</p>}
          <button className="login-button" onClick={this.handleSubmit}>
            Let's Play
          </button>
        </div>
      </div>
    );
  }
}

export default LoginForm;
