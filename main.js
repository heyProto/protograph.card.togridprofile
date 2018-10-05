import React from 'react';
import {render, hydrate} from 'react-dom';
import Card from './src/js/card.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};


ProtoGraph.Card.toGridProfile = function() {
    this.cardType = 'Grid Profile';
}

ProtoGraph.Card.toGridProfile.prototype.init = function(options) {
    this.options = options;
}

ProtoGraph.Card.toGridProfile.prototype.getData = function(data) {
    return this.containerInstance.exportData();
}

ProtoGraph.Card.toGridProfile.prototype.renderScreenshot = function(data) {
    this.mode = 'screenshot';
    this.render();
}

ProtoGraph.Card.toGridProfile.prototype.render = function() {
    if (this.options.isFromSSR){
        hydrate(
          <Card
            selector={this.options.selector}
            dataURL={this.options.data_url}
            siteConfigs={this.options.site_configs}
            renderingSSR={true}
          />,
          this.options.selector);
      } else {
        render(
          <Card
            dataURL={this.options.data_url}
            selector={this.options.selector}
            domain={this.options.domain}
            siteConfigURL={this.options.site_config_url}
            mode={this.mode}
            siteConfigs={this.options.site_configs}
            clickCallback={this.options.onClickCallback}
            ref={(e) => {
              this.containerInstance = this.containerInstance || e;
            }} />,
          this.options.selector);
    }
    
}