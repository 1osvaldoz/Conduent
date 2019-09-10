import React, { Component } from 'react';
import './App.css';
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import { Col, Input, InputGroup, InputGroupAddon, FormGroup, Label, Button, Fade, FormFeedback, Container, Card } from 'reactstrap';
import Chart from './Components/chart'
import $ from 'jquery';
import Weather from './Components/weather'
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dataLoaded: false,
      isFormInvalid: false,
      rows: null,
      cols: null
    }
    this.fileHandler = this.fileHandler.bind(this);
    this.toggle = this.toggle.bind(this);
    this.openFileBrowser = this.openFileBrowser.bind(this);
    this.renderFile = this.renderFile.bind(this);
    this.openNewPage = this.openNewPage.bind(this);
    this.fileInput = React.createRef();
  }

  renderFile = (fileObj) => {
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      }
      else {
        this.setState({
          dataLoaded: true,
          //          cols: resp.cols,
          cols: getColumnNames(resp.rows),
          rows: getRows(resp.rows),
          getInfo: generaInfo(resp.rows)
        });
      }
    });
  }

  fileHandler = (event) => {
    if (event.target.files.length) {
      let fileObj = event.target.files[0];
      let fileName = fileObj.name;


      //check for file extension and pass only if it is .xlsx and display error message otherwise
      if (fileName.slice(fileName.lastIndexOf('.') + 1) === "xlsx") {
        this.setState({
          uploadedFileName: fileName,
          isFormInvalid: false
        });
        this.renderFile(fileObj)
      }
      else {
        this.setState({
          isFormInvalid: true,
          uploadedFileName: ""
        })
      }
    }
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  openFileBrowser = () => {
    this.fileInput.current.click();
  }

  openNewPage = (chosenItem) => {
    const url = chosenItem === "github" ? "https://github.com/ashishd751/react-excel-renderer" : "https://medium.com/@ashishd751/render-and-display-excel-sheets-on-webpage-using-react-js-af785a5db6a7";
    window.open(url, '_blank');
  }

  render() {
    return (
      <div className="back">
        <Weather></Weather>

        <Container>
          
          <form>
            <FormGroup row>


              <Col xs={12} sm={12} lg={12}>

              </Col>

              <div className="col-lg-2">
                <Label for="exampleFile"  size="lg">Cargar archivo</Label>
              </div>
              <div className="col-lg-10">
                <Col xs={4} sm={8} lg={10}>



                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      
                      <input type="file" id="txtFile" hidden onChange={this.fileHandler.bind(this)} ref={this.fileInput} onClick={(event) => { event.target.value = null }} style={{ "padding": "10px" }} />
                      <Button color="info" style={{ color: "white", zIndex: 0 }} onClick={this.openFileBrowser.bind(this)}><i className="cui-file"></i> Examinar&hellip;</Button>
                    </InputGroupAddon>
                    <Input type="text" className="form-control" value={this.state.uploadedFileName} readOnly invalid={this.state.isFormInvalid} />
                    <FormFeedback>
                      <Fade in={this.state.isFormInvalid} tag="h6" style={{ fontStyle: "italic" }}>
                        Favor de seleccionar un archivo .xlsx !
                  </Fade>
                    </FormFeedback>
                  </InputGroup>
                </Col>
              </div>  
              <div className="col-lg-4">
               
              </div>
            </FormGroup>

          </form>

          {this.state.dataLoaded &&

            <div className="row">
             

             <div class="col-lg-6">


Peor estudiante: <b>{this.state.getInfo.peorEstudiante}</b>
<br /> Mejor estudiante: <b>{this.state.getInfo.mejorEstudiante}</b>
<br /> Promedio general de estudiantes: <b>{this.state.getInfo.promedio}  </b>
<br></br>

</div>
              <div class="col-4">
                
                <input type="number" className="form-control" id="txtTransformar" ></input>
              </div>  <div class="col-2">
              <Button color="info"  style={{ color: "white", zIndex: 0 }} onClick={transformar}> Transformar&hellip;</Button>
              </div>

              <div class="col-lg-12">
              <br></br>
              </div>
             
              <div class="col-lg-12">
              <br></br>
              </div>
              <div class="col-lg-6">
              <OutTable data={this.state.rows} columns={this.state.cols} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" id="tblInfo" />
              </div>
              <div class="col-lg-6">
              <Chart
                data={this.state.getInfo.grafica}
              ></Chart>
              </div>
             
            </div>
          }

        </Container>
      </div>
    );
  }
}
function generaInfo(objx) {
  var resultados = {}
  var sumRows = {}
  var sumaGeneral = 0;

  var min = 11, max = -1, peorEstudiante = "", mejorEstudiante = "";
  for (var prop in objx) {
    var row = objx[prop];
    if (prop != 0 && !isNaN(row[6])) {
      sumaGeneral += row[6];
      // sumRows.hasOwnProperty("grupo" + row[5]
      if (sumRows.hasOwnProperty("Cal" + row[6])) {
        sumRows["Cal" + row[6]].nEstudiantes += 1;
      }
      else {
        sumRows["Cal" + row[6]] = {};
        sumRows["Cal" + row[6]].Calificacion = row[6];
        sumRows["Cal" + row[6]].nEstudiantes = 1;
      }

      if (row[6] < min) {
        min = row[6];
        peorEstudiante = row[0] + ' ' + row[1] + ' ' + row[2];
      } else {
        if (row[6] == min) {
          peorEstudiante += ', ' + row[0] + ' ' + row[1] + ' ' + row[2];
        }
      }
      if (row[6] > max) {
        max = row[6];
        mejorEstudiante = row[0] + ' ' + row[1] + ' ' + row[2];;
      } else {
        if (row[6] == max) {
          mejorEstudiante += ', ' + row[0] + ' ' + row[1] + ' ' + row[2];;
        }
      }
    }
  }
  resultados.grafica = regresaDataGrafica(sumRows);
  resultados.mejorEstudiante = mejorEstudiante;
  resultados.peorEstudiante = peorEstudiante;
  resultados.promedio = Number(sumaGeneral / objx.length).toFixed(2);
  console.log(resultados);
  return resultados;
}

function getColumnNames(columns) {
  var newCols = [], i = 1;
  var newCol2 = {}
  newCol2.name = columns[0][prop];
  newCol2.key = 0;
  newCols.push(newCol2);
  for (var prop in columns[0]) {
    var newCol = {}
    newCol.name = columns[0][prop];
    newCol.key = i;
    newCols.push(newCol);
    i++;

  }
  var newColClave = {}
  newColClave.name = "Clave";
  newColClave.key = i;
  newCols.push(newColClave);
  return newCols;
}
function getRows(rows) {
  rows.shift(); // returns "zero"
  for (var prop in rows) {
    if (rows[prop][0] != "" && rows[prop][0] != null) {
      var row = rows[prop];
      var nombre = regresa3Pos(String(rows[prop][0]).substring(0, 2) + String(rows[prop][1]).substring((String(rows[prop][3]).length - 5), (String(rows[prop][3]).trim().length - 1)))
      var fechaString = String(rows[prop][3]).split("/")
      var fecha = new Date(fechaString[2], fechaString[1], fechaString[0]);
      var edad = String(regresaEdad(fecha))
      var codigoAlumno = nombre + edad;
      rows[prop][7] = codigoAlumno.toUpperCase();
    }
  }

  return rows;
}
function regresa3Pos(palabra) {
  var letras = String(palabra).toLowerCase().split("");
  var nuevaPalabra = ""
  var i = 0;
  var abc = new Array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
  for (var i = 0; i < palabra.length; i++) {
    var letra = letras[i];
    var index = abc.indexOf(letra);
    var newIndex = index - 3
    newIndex = newIndex < 0 ? (abc.length - Math.abs(newIndex)) : newIndex
    nuevaPalabra += abc[newIndex];
  }

  return nuevaPalabra;

}

function regresaEdad(fechaNacimiento) {

  var dia = fechaNacimiento.getDate();
  var mes = fechaNacimiento.getMonth();
  var ano = fechaNacimiento.getYear();

  var fecha_hoy = new Date();
  var ahora_ano = fecha_hoy.getYear();
  var ahora_mes = fecha_hoy.getMonth();
  var ahora_dia = fecha_hoy.getDate();
  var edad = (ahora_ano + 1900) - ano;

  if (ahora_mes < (mes - 1)) {
    edad--;
  }
  if (((mes - 1) == ahora_mes) && (ahora_dia < dia)) {
    edad--;
  }
  if (edad > 1900) {
    edad -= 1900;
  }

  return edad
}
function regresaDataGrafica(data) {
  var labels = [];
  var dataFrom = [];
  for (var prop in data) {
    labels.push(data[prop].Calificacion)
    dataFrom.push(data[prop].nEstudiantes)
  }


  var chartData = {
    labels: labels,
    datasets: [
      {
        label: 'N° de estudiantes',
        data: dataFrom,
        backgroundColor: [
          'rgba(255, 99, 132 )',
          'rgba(54, 162, 235 )',
          'rgba(255, 206, 86 )',
          'rgba(75, 192, 192 )',
          'rgba(153, 102, 255 )',
          'rgba(255, 159, 64 )',
          'rgba(255, 99, 132 )'
        ]
      }
    ]

  }
  return chartData;
}

function transformar() {


  var rows = $(".ExcelTable2007")[0].children[0].childNodes;
  var len = rows.length;
  var nVeces = Number($("#txtTransformar").val());
  for (var i = 0; i < len; i++) {
    var row = $(".ExcelTable2007")[0].children[0].childNodes[i];
    var clave = row.cells[8].innerText;
    var nvaClave = volverNveces(clave, nVeces);
    if (row.cells.length != 10) {
      if (i == 0) {
        row.outerHTML = row.outerHTML.replace("</tr>", "") + "<th class>Trans</th></tr>"
      }
      else {
        row.outerHTML = row.outerHTML.replace("<td></td></tr>", "") + "<td>" + nvaClave + "</td></tr>"

      }
    }
    else {
      if (i != 0) {
        if (row.cells[9].innerText != '') {
          row.cells[9].outerHTML = "<td>" + nvaClave + "</td>"
        }
        else {
          row.cells[9].outerHTML = "<td>" + nvaClave + "</td>"
        }
      }
    }
  }
}
function volverNveces(palabra, nVeces) {
  var palabraTran = palabra;
  for (var j = 0; j < nVeces; j++) {
    var nuevaPalabra = ""
    for (var i = 0; i < palabra.length; i++) {
      var letras = String(palabra).toLowerCase().split("");
      var newIndex = palabra.length + 1 + i
      newIndex = newIndex > palabra.length ? (Math.abs(palabra.length - newIndex)) : newIndex
      nuevaPalabra += letras[newIndex == palabra.length ? 0 : newIndex];
      palabraTran = nuevaPalabra;
    }
    palabra = palabraTran
  }
  return palabraTran.toUpperCase();
}



export default App;
