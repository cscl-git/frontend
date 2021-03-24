import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
//import Icon from "@material-ui/core/Icon";
import Icon from "egov-ui-framework/ui-atoms/Icon";
import './index.css'
const styles = theme => ({
  root: {
    display: "flex"
  },
  paper: {
    marginRight: theme.spacing.unit * 2
  },
  button: {
    border: "1px solid #FE7A51"
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
});

class MenuListComposition extends React.Component {
  state = {
    open: false
  };

  handleToggle = async () => {
    
    const { open } = this.state;
    this.setState({ open: !open });
    if (this.props.handleCheckAvailability) { await this.props.handleCheckAvailability(this.props.Booking, this.props.dispatch) }

  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  };

  render() {
    const { classes, data } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root , "outerDiv"} data-html2canvas-ignore={true}>
        <div className = {"innerDiv"}>
          <Button className={classes.button}
            buttonRef={node => {
              this.anchorEl = node;
            }}
            aria-owns={open ? "menu-list-grow" : null}
            aria-haspopup="true"
            onClick={()=>{setTimeout(this.handleToggle,1000)}}
            {...data.props}
          >
            <Icon className={classes.leftIcon} iconName={data.leftIcon} />
            <LabelContainer labelName={data.label.labelName} labelKey={data.label.labelKey} style={{ color: data.props.style.color }} />
            <span style={{ marginLeft: 30, color: data.props.color }}> |  </span>
            <Icon className={classes.rightIcon} iconName={data.rightIcon} color={data.props.color} />
          </Button>
          <Popper open={open} anchorEl={this.anchorEl} style={{ zIndex: 100 }} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList>
                      {data.menu.map((item, key) => {
                        const { labelName, labelKey } = item.label;
                        return (
                          <MenuItem key={key} onClick={item.link}>
                            <Icon
                              className={classes.leftIcon}
                              iconName={item.leftIcon}
                            />
                            <LabelContainer
                              labelName={labelName}
                              labelKey={labelKey}
                            />
                            <Icon
                              className={classes.leftIcon}
                              iconName={item.rightIcon}
                            />
                          </MenuItem>
                        );
                      })}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    );
  }
}

MenuListComposition.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {

  const { screenConfiguration } = state
  return { Booking:  screenConfiguration.preparedFinalObject.Booking}

 

};


const mapDispatchToProps = (dispatch) => {

  return {dispatch: dispatch}

};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MenuListComposition));



