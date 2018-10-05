import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class toCard extends React.Component {

  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      optionalConfigJSON: {},
      languageTexts: undefined,
      siteConfigs: this.props.siteConfigs
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
    }

    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }

    this.state = stateVar;
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  componentDidMount() {
    if (this.state.fetchingData) {
      let items_to_fetch = [
        axios.get(this.props.dataURL)
      ];

      axios.all(items_to_fetch).then(axios.spread((card) => {
        let stateVar = {
          fetchingData: false,
          dataJSON: card.data,
          optionalConfigJSON:{}
        };
        this.setState(stateVar);
      }));
    } 
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON
      });
    }
  }

  renderIcons(platforms) {
    let iconDefaults = [
      {
        type: "Facebook",
        icon_url: "https://next.pro.to/assets/social-icons/facebook.png"
      },
      {
        type: "Twitter",
        icon_url: "https://next.pro.to/assets/social-icons/twitter.png"
      },
      {
        type: "Whatsapp",
        icon_url: "https://next.pro.to/assets/social-icons/whatsapp.png"
      },
      {
        type: "Instagram",
        icon_url: "https://next.pro.to/assets/social-icons/instagram.png"
      },
      {
        type: "Youtube",
        icon_url: "https://next.pro.to/assets/social-icons/youtube.png"
      },
      {
        type: "Other",
        icon_url: "https://next.pro.to/assets/social-icons/facebook.png"
      }
    ];
    let icons = [];
    let counter = 0;
    iconDefaults.forEach(x => {
      let index = platforms.findIndex(platform => platform.type === x.type);
      let categoryIcons = [];
      while (index >= 0) {
        let iconImage = platforms[index].icon_url || x.icon_url;
        categoryIcons.push(
          <div key={counter} className="single-icon">
            <a href={platforms[index].url}><img src={iconImage} /></a>
          </div>
        );
        counter += 1;
        platforms.splice(index, 1);
        index = platforms.findIndex(platform => platform.type === x.type);
      }
      icons.push(...categoryIcons);      
    });
    let visible = icons.length > 4 ? icons.slice(0,4) : icons;
    let hidden = icons.slice(4).length;
    return(
      visible.length > 0 && <div className="grid-card-icons-footer">
        {visible}{hidden > 0 && <div className="more-icons-text">and {hidden} more</div>}
      </div>);
    
  }

  render() {
    if (this.state.fetchingData) {
      return (
        <div></div>
      )
    } else {
      let data = this.state.dataJSON;
      return (
        <div className="proto-website-grid-card">
          <div className="grid-card-cover">
            <img src={data.img_url} height="220" width="220" />
          </div>
          <div className="grid-card-title">{data.title}</div>
          {data.subtitle && <div className="grid-card-subtitle">{data.subtitle}</div>}
          {data. description && <p>{data.description}</p>}
          {data.platforms && data.platforms.length > 0 && this.renderIcons(data.platforms)}
        </div>
      );
    }
  }
}
