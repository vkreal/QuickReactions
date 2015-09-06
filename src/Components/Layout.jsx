var React = require('react');

module.exports = React.createClass({
    render: function() {
        var body = { 
            margin: '0', 
            fontFamily: 'arial',
            fontSize: 'small'
        };
        
        return (
            <html>
                <head>
                   <title>API Proof Of Concept</title>
                </head>
                <body style={body}>
                    <div id="NuiApiTest" dangerouslySetInnerHTML={{__html: this.props.content}} />
                </body>  
                <script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
                <script src="/pages/index.js"></script> 
            </html>
        )
    }
})