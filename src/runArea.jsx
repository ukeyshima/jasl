import React from 'react';
import RunAreaHeader from './runAreaHeader.jsx';
import { inject, observer } from 'mobx-react';
import * as glsl from 'glsl-man';

@inject(({ state }) => ({
  iframeElement: state.iframeElement,
  updateIframeElement: state.updateIframeElement,
  updateExecuteHTML: state.updateExecuteHTML,
  textFile: state.textFile,
  gl:state.gl,
  updateGlContext:state.updateGlContext
}))
@observer
export default class RunArea extends React.Component {  
  async componentDidMount() {
    this.canvas=document.createElement('canvas');        
    this.props.updateGlContext(this.canvas.getContext('webgl'));
    await this.props.updateIframeElement(this.refs.iframe);
    this.props.updateExecuteHTML(this.executeHTML);
    this.executeHTML(this.props.textFile);   
  }
  componentWillUnmount() {
    this.props.updateIframeElement(null);
  }  
  codeSearch = (code, name) => {
    let result = null;
    glsl.parse(code).statements.forEach(e => {
      switch (e.type) {
        case 'declarator':
          if (e.declarators[0].name.name === name) result = e;
          break;
        case 'function_declaration':
          if (e.name === 'main') {
            e.body.statements.forEach(f => {
              if (
                f.hasOwnProperty('declarators') &&
                f.declarators[0].name.name === name
              ) {
                result = f;
              }
            });
          } else {
            if (e.name === name) result = e;
          }
          break;
      }
    });
    return result;
  };
  returnType = (code, name) => {
    let object = this.codeSearch(code, name);
    let result = { type: 'float', function: false, parameter: null };
    if (object) {
      switch (object.type) {
        case 'declarator':
          result = {
            type: object.typeAttribute.name,
            function: false,
            parameter: null
          };
          break;
        case 'function_declaration':
          result = {
            type: object.returnType.name,
            function: true,
            parameter: object.parameters.map(e => e.type_name)
          };
          break;
        default:
          break;
      }
    }
    return result;
  };
  typeDetermination = (code,expression) => {       
    const gl=this.props.gl;    
    const shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(
      shader,
      `void main(void) {
        float expression${expression};
      }`
    );    
    gl.compileShader(shader);
    let infolog = gl.getShaderInfoLog(shader);      
    const undefinedsVariable = infolog.match(
      /\'[^\n]*\' : undeclared identifier/g
    );
    const undefinedsFunction = infolog.match(
      /\'[^\n]*\' : no matching overloaded function found/g
    );
    let undefineds = [];
    if (undefinedsVariable) {
      undefineds = undefineds.concat(undefinedsVariable);
    }
    if (undefinedsFunction) {
      undefineds = undefineds.concat(undefinedsFunction);
    }
    undefineds = undefineds.filter((x, i, self) => self.indexOf(x) === i);    
    undefineds = undefineds.map(e => {
      const name = e.split("'")[1];
      const type = this.returnType(code, e.split("'")[1]);
      return {
        name: name,
        type: type.type,
        function: type.function,
        parameter: type.parameter
      };
    });
    let define = ''; 
    undefineds.forEach(e => {
      define += e.function
        ? `${e.type} ${e.name}(${(() => {
            let result = '';
            e.parameter.forEach((f, i) => {
              result += `${f} x${i},`;
            });
            result = result.slice(0, result.length - 1);
            return result;
          })()}){
        return ${e.type}(0.0);
      }\n`
        : `${e.type} ${e.name} = ${e.type}(0.0);\n`;
    });
    gl.shaderSource(
      shader,
      `${define}
        void main(void) {        
          float expression${expression};
        }`
    );
    gl.compileShader(shader);
    infolog = gl.getShaderInfoLog(shader); 
    const splitText = infolog.split("'");        
    const errorText = splitText[splitText.length - 4];    
    let result = '';        
    switch (errorText) { 
      case 'const int':
        result = 'int';
        break;
      case 'int':
        result = 'int';
        break;
      case 'const float':
        result = 'float';
        break;
      case 'float':
        result = 'float';
        break;
      case 'const highp 2-component vector of float':
        result = 'vec2';
        break;
      case "const 2-component vector of float":
        result="vec2";
        break;
      case 'highp 2-component vector of float':
        result = 'vec2';
        break;
        case 'mediump 2-component vector of float':
        result ='vec2';
        break;
      case 'const highp 3-component vector of float':
        result = 'vec3';
        break;
        case "const 3-component vector of float":
        result="vec3";
        break;
      case 'highp 3-component vector of float':
        result = 'vec3';
        break;
        case 'mediump 3-component vector of float':
        result = 'vec3';
        break;
      case 'const highp 4-component vector of float':
        result = 'vec4';
        break;
        case "const 4-component vector of float":
        result="vec4";
        break;
      case 'highp 4-component vector of float':
        result = 'vec4';
        break;
        case 'mediump 4-component vector of float':
        result = 'vec4';
        break;
      case 'const highp 2X2 matrix of float':
        result = 'mat2';
        break;
        case 'const 2X2 matrix of float':
        result = 'mat2';
        break;
      case 'highp 2X2 matrix of float':
        result = 'mat2';
        break;
        case 'mediump 2X2 matrix of float':
        result = 'mat2';
        break;
      case 'const highp 3X3 matrix of float':
        result = 'mat3';
        break;
        case 'const 3X3 matrix of float':
        result = 'mat3';
        break;
      case 'highp 3X3 matrix of float':
        result = 'mat3';
        break;
        case 'mediump 3X3 matrix of float':
        result = 'mat3';
        break;
      case 'const highp 4X4 matrix of float':
        result = 'mat4';
        break;
        case 'const 4X4 matrix of float':
        result = 'mat4';
        break;
      case 'highp 4X4 matrix of float':
        result = 'mat4';
        break;
        case 'mediump 4X4 matrix of float':
        result = 'mat4';
        break;
      default:
        result = 'float';
        break;
    }
    return result;
  };
  executeHTML = textFile => {
    const domParser = new DOMParser();
    let document_obj = null;
    try {
      document_obj = domParser.parseFromString(textFile[0].text, 'text/html');
      if (document_obj.getElementsByTagName('parsererror').length) {
        document_obj = null;
      }
    } catch (e) {
      console.log(e);
    }
    if (document_obj) {
      const scripts = Array.prototype.slice.call(
        document_obj.getElementsByTagName('script')
      );
      const links = Array.prototype.slice.call(
        document_obj.getElementsByTagName('link')
      );
      scripts.forEach(e => {
        if (e.src) {
          const fileName = e.src.split('/')[e.src.split('/').length - 1];
          const targetOfJs = textFile.find(f => {
            return f.fileName === fileName;
          });
          if (targetOfJs) {
            const blob = new Blob([targetOfJs.text], {
              type: 'application/javascript'
            });
            e.src = URL.createObjectURL(blob);
          }
        } else {
          const targetOfNotJs = textFile.find(f => {
            return f.fileName === e.type;
          });          
          let targetOfNotJsText=targetOfNotJs.text;          
          const varVariable=targetOfNotJsText.match(/var[^;]*/g);          
          varVariable&&varVariable.forEach(e=>{
            const variable=e.match(/var[^=]*/g);            
            const expression=e.replace(variable,"");
            const type=this.typeDetermination(targetOfNotJsText,expression);           
            targetOfNotJsText=targetOfNotJsText.replace(e,`${type}${variable[0].replace("var","")}${expression}`)
          })          
          e.text = targetOfNotJsText;
        }
      });
      links.forEach(e => {
        const fileName = e.href.split('/')[e.href.split('/').length - 1];
        const targetOfCss = textFile.find(f => {
          return (
            f.type === 'css' &&
            e.rel === 'stylesheet' &&
            fileName === f.fileName
          );
        });
        if (targetOfCss) {
          const blob = new Blob([targetOfCss.text], { type: 'text/css' });
          e.href = URL.createObjectURL(blob);
        }
      }); 
      if (document_obj.documentElement) {
        const blob = new Blob([document_obj.documentElement.outerHTML], {
          type: 'text/html'
        });
        this.props.iframeElement.contentWindow.location.replace(
          URL.createObjectURL(blob)
        );
      }
    }
  };
  render() {
    return (
      <div onMouseUp={this.handleMouseUp} style={this.props.style}>
        <RunAreaHeader />
        <iframe
          touch-action="auto"
          ref="iframe"
          style={{
            width: this.props.style.width,
            height: this.props.style.height - 20,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            borderWidth: 0
          }}
        />
      </div>
    );
  }
}
