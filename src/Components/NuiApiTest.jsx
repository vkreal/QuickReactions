var React = require('react');

module.exports = React.createClass({
    getInitialState: function() {
        return {api_json: []};
    },
    componentDidMount: function() {
        $.get("/api", function(result) { 
            if (this.isMounted()) {
                this.setState({
                    api_json : result
                });
            }
        }.bind(this));
    },
    onClick_run: function(event) {
       var classValue = document.getElementById('Class').value;
       if(classValue == "xx") {
           return;
       }
       var params = [];
       if( document.getElementById('Request').value	!= '{ /* void */ }' ) {
            var jsonValues = JSON.parse(document.getElementById('Request').value);
            if( jsonValues ) {
                for(var key in jsonValues) {
                    params.push(jsonValues[key] ? jsonValues[key] : '');
                }
            }
       }
       if((params.length == 1) && (typeof(params[0]) == 'object')) {
	       params = params[0];
	   }

      var payload = [{action:classValue, method:document.getElementById('Method').value, data:params}];
      
       $.ajax({
            url: '/router',
            dataType: 'text',
            type: 'POST',
            data: JSON.stringify(payload),
            success: function(data) {
                document.getElementById('Response').value = data;
            }.bind(this),
            error: function(xhr, status, err) {
                document.getElementById('Response').value = err.toString();
            }.bind(this)
        });
    },
    onChange_method: function(event) {
        this.clear_TextArea();                
        var s = this.state.api_json[document.getElementById('Class').value][event.target.options[event.target.selectedIndex].value];
        if( s != '{ /* void */ }' ) {
            try {          
                var json_data = JSON.parse(s);   // HACK TO MAKE FORMAT PRETTY :)              
                s = JSON.stringify(json_data, null, 4); 
            }
            catch(e) {}                                                                                            
        }                
        document.getElementById('Request').value = s;                     
    },
    clear_TextArea: function() {
        document.getElementById('Response').value = ''; 
        document.getElementById('Request').value = '';             
	}, 
    onChange_class: function(event) {
        var select = event.target;
        var clazz = select.options[select.selectedIndex].value;
        this.clear_TextArea();
        if(this.state.api_json[clazz]) {
            var select = document.getElementById('Method');      
            select.innerHTML = '';                                      

            for(var methodName in this.state.api_json[clazz]) {
                var option = document.createElement('option');
                option.value = methodName;
                option.innerHTML = methodName;                                                                     
                select.appendChild(option);          
            }
            this.onChange_method({target: select});                  
        } else {
            var select = document.getElementById('Method');      
            select.innerHTML = ''; 
        }
    }, 
    render: function() {
       
		var h1 = {
					color: '#FFF', 
					fontSize: 'large',
					padding: '0.5em',
					backgroundColor: '#003366', 
					marginTop: '0'
				};
                
		var Content = {
					margin: '1em'
				};
		var RequestResponse = {
					display: 'block',
					marginTop: '0.5em',
					width: '90%'
				};
		var Headers = {
					fontFamily: 'Monospace',
					fontSize: 'small'
		};
        
        var Header1 = {
            margin:'10px',
            padding:'5px'
        };
        
        var marginLeft= {
            marginLeft: '20px'
        };
        
        var marginRight= {
            marginRight: '20px'
        };
        
        var rows = [];
        rows.push(<option value='xx'>---</option>);
        for (var clazz in this.state.api_json) {
            rows.push(<option value={clazz}>{clazz}</option>);
        }      
        return (
            <div>
                <div>
                    <h1 style={h1}>API Proof Of Concept</h1>
                </div>
                <div style={Content}>
                    <span className='service-help'>This is a Proof Of Concept that can be use to call blah api.</span>
            
                    <form id='TestForm'>
                        <p>
                            Select class:
                            <select name='Class' id='Class' style={marginRight} onChange={this.onChange_class}>
                                {rows}
                            </select>
            
                            Select method to run:
                            <select name='Method' id='Method' style={marginRight} onChange={this.onChange_method}></select>
                            <input name='Test' type='button' id='Test' value='Run' style={marginLeft} onClick={this.onClick_run} />
                        </p>
                         <p>Request parameters: <textarea name='Request' id='Request' style={RequestResponse} rows='10' title='Enter the array of parameters (in JSON) to send in the RPC request.'></textarea></p>
                         <p>Response result/error: <textarea name='Response' id='Response' style={RequestResponse} rows='10' readonly='readonly' title='The result or error object (in JSON) from the last RPC response.'></textarea></p>
                    </form>
                    <p id='Stats'></p><pre id='Headers'></pre>
                </div>
            </div>
        )
    }
})