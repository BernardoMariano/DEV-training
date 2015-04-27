import $ from 'jquery';

export function Menu {
    // Renders <li>
    var MenuItem = React.createClass({
        getInitialState: function() {
            var item = this.props.data;
            return {
                text: item.text,
                subMenu: item.menu ? <MenuList data={item.menu} /> : null
            }
        },
        render: function() {
            return (
                <li>
                    {this.state.text}
                    {this.state.subMenu}
                </li>
            );
        }
    });


    // Renders <ul>
    var MenuList = React.createClass({
        componentDidMount: function() {
            if (!this.props.url) {
                this.setState({data: this.props.data});
            } else {
                $.ajax({
                    url: this.props.url,
                    dataType: 'json',
                    success: function(response) {
                        this.setState({data: response.menu});
                    }.bind(this)
                });
            }
        },
        getInitialState: function() {
            return {
                data: []
            }
        },
        render: function() {
            var items = [];
            this.state.data.map(function(item, index) {
                items.push(
                    <MenuItem data={item} key={index} />
                );
            });
            return (
                <ul className='menuList'>
                    {items}
                </ul>
            );
        }
    });

    React.render(
      <MenuList url='data.json' />,
      document.getElementById('menu-app')
    );
}

Menu();