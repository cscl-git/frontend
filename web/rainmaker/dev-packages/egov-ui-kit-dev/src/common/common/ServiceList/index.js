import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Icon from "egov-ui-kit/components/Icon";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Label from "egov-ui-kit/utils/translationNode";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import "./index.css";


import { getUserInfo} from '../../../utils/localStorageUtils'
 const styles = (theme) => ({
  webRoot: {
    flexGrow: 1,
    width: "10%",
    padding:"1%"
  },
  mobileRoot: {
    flexGrow: 1,
    padding:'1%',
    width: "25%",
  },
  mobileRoot1: {
    flexGrow: 1,
    padding:'1%',
    width: "33%",
  },
  paper: {
    borderRadius: 0,
    marginTop: 0,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    cursor: "pointer",
  },
  icon: {
    color: "#fe7a51",
  },
  item: {
    padding: 8,
  },
});

// const services = [
//   {
//     label: "Complaints",
//     icon: <Icon className="service-icon" action="custom" name="comment-plus" />,
//     route: "/pgr-home",
//   },
//   { label: "Property Tax", icon: <Icon className="service-icon" action="custom" name="home-city-outline" />, route: "/property-tax" },
//   { label: "Trade License", icon: <Icon className="service-icon" action="custom" name="trade-license" />, route: "/tradelicense-citizen/home" },
//   { label: "Fire Noc", icon: <Icon className="service-icon" action="custom" name="fire" />, route: "fire-noc/home" },
// ];

class ServiceList extends React.Component {
  state = {
    actionList: [],
  };
  componentWillReceiveProps(nextProps) {
    const { menu } = nextProps;
    let list ;
    if(process.env.REACT_APP_NAME === "Citizen"){
      list = menu && menu.filter((item) => item.url === "card" && item.name.startsWith("rainmaker-citizen"));
       //filter list bassed on condition include mobile number()
    const userInfo = JSON.parse(getUserInfo());
    let ContactNumber =[
      {
        Number:"9748345660"//P
      },
      {
        Number:"8961201542"//T
      },
      {
        Number:"8100277847"//S
      },
      {
        Number:"7207303021"//SRI
      },
      {
        Number:"7385213293"//R
      },
      {
        Number:"7405490720"//N
      },
      {
        Number:"9039000009"//AG
      },
      {
        Number:"7558357883"//A
      }
    ]
    ContactNumber = ContactNumber.filter((item)=>item.Number === userInfo.mobileNumber)
    if(ContactNumber.length ===0)
    {
      list = list.filter((item)=>item.name !=='rainmaker-citizen-wns'
                                && item.name !== 'rainmaker-citizen-rented-properties'
                                && item.name !== 'rainmaker-citizen-estate-properties')

    }
    }else{
      list = menu && menu.filter((item) => item.url === "card");
    }
    this.setState({
      actionList: list,
    });
  }
  render() {
    const { classes, history } = this.props;
    const { actionList } = this.state;
    return (
      <Grid container>
        <Hidden smUp>
          {actionList.map((service) => {
            const translatedLabel = service.displayName.toUpperCase().replace(/[.:\-\s]/g, "_");

            return (
              <Grid className={(actionList.length===6 ||actionList.length===5 || actionList.length===9 )? classes.mobileRoot1:classes.mobileRoot } item align="center">
                <Card
                  className={classes.paper}
                  onClick={(e) => {
                    history.push(service.navigationURL);
                  }}
                >
                  <CardContent classes={{ root: "card-content-style" }}>
                    {/* {service.icon} */}
                    <Icon className="service-icon" action={service.leftIcon.split(":")[0]} name={service.leftIcon.split(":")[1]} />
                    <Label className="service-label-cont" label={`ACTION_TEST_${translatedLabel}`} fontSize={12} color="rgba(0, 0, 0, 0.87)" />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Hidden>

        <Hidden xsDown>
          {actionList.map((service) => {
            const translatedLabel = service.displayName.toUpperCase().replace(/[.:\-\s]/g, "_");
            return (
              <Grid className={classes.webRoot} item align="center">
                <Card
                  className={`${classes.paper} service-module-style`}
                  onClick={(e) => {
                    history.push(service.navigationURL);
                  }}
                >
                  <CardContent classes={{ root: "card-content-style" }}>
                    {/* <div>{service.icon}</div> */}
                    <Icon className="service-icon" action={service.leftIcon.split(":")[0]} name={service.leftIcon.split(":")[1]} />
                    <Label className="service-label-cont" label={`ACTION_TEST_${translatedLabel}`} fontSize={14} color="rgba(0, 0, 0, 0.87)" />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Hidden>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, app } = state;
  const { menu } = app;
  const { userInfo } = auth;
  const name = auth && userInfo.name;

  return { name, menu };
};
export default withStyles(styles)(
  connect(
    mapStateToProps,
    null
  )(ServiceList)
);
