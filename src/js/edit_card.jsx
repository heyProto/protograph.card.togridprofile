import React from 'react';
import axios from 'axios';
import Card from './card.jsx';
import Form from '../../lib/js/react-jsonschema-form';

export default class editToCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataJSON: {},
      publishing: false,
      schemaJSON: undefined,
      fetchingData: true,
      uiSchemaJSON: {}
    }
  }

  exportData() {
    let getDataObj = {
      dataJSON: this.state.dataJSON,
      schemaJSON: this.state.schemaJSON
    }
    return getDataObj;
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object.
    if (this.state.fetchingData){
      axios.all([
        axios.get(this.props.dataURL),
        axios.get(this.props.schemaURL),
        axios.get(this.props.uiSchemaURL)
      ])
      .then(axios.spread((card, schema, uiSchema) => {
        let stateVars = {
          fetchingData: false,
          dataJSON: card.data,
          schemaJSON: schema.data,
          uiSchemaJSON: uiSchema.data
        };
        this.setState(stateVars);
      }));
    }
  }

  onChangeHandler({formData}) {
    this.setState({
        dataJSON : formData
    })  
  }

  onSubmitHandler({formData}) {
    if (typeof this.props.onPublishCallback === "function") {
      let dataJSON = this.state.dataJSON;
      this.setState({ publishing: true, dataJSON: dataJSON });
      let publishCallback = this.props.onPublishCallback();
      publishCallback.then((message) => {
        this.setState({ publishing: false });
      });
    }
  }


  renderSEO() {
    let d = this.state.dataJSON;

    let blockquote_string = `<h1>${d.title}</h1><h2>${d.subtitle}</h2><p>${d.description}</p>`;
    let seo_blockquote = '<blockquote>' + blockquote_string + '</blockquote>'
    return seo_blockquote;
  }

  render() {
    if (this.state.fetchingData) {
      return(<div>Loading</div>)
    } else {
      return (
        <div className="proto-container">
          <div className="ui grid form-layout">
            <div className="row">
              <div className="four wide column proto-card-form protograph-scroll-form">
                <div>
                  <div className="section-title-text">Fill the form</div>
                  <div className="ui label proto-pull-right">
                    toGridProfile
                  </div>
                </div>
                <Form schema={this.state.schemaJSON}
                  onSubmit={((e) => this.onSubmitHandler(e))}
                  onChange={((e) => this.onChangeHandler(e))}
                  uiSchema={this.state.uiSchemaJSON}
                  formData={this.state.dataJSON}>
                  <br/>
                  <button type="submit" className={`${this.state.publishing ? 'ui primary loading disabled button' : ''} default-button protograph-primary-button`}>Publish</button>
                </Form>
              </div>
              <div className="twelve wide column proto-card-preview proto-share-card-div">
                <div className="protograph-app-holder">
                  <Card
                    dataJSON={this.state.dataJSON}
                    schemaJSON={this.state.schemaJSON}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}
