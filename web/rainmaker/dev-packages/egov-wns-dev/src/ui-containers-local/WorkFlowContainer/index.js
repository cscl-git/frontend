import React from "react";
import { connect } from "react-redux";
//import TaskStatusContainer from "../TaskStatusContainer";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { Footer } from "../../ui-molecules-local";
import {
  getQueryArg,
  addWflowFileUrl,
  orderWfProcessInstances,
  getMultiUnits
} from "egov-ui-framework/ui-utils/commons";
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";
import find from "lodash/find";
import {
  localStorageGet,
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import orderBy from "lodash/orderBy";
import { getSearchResults} from "../../ui-utils/commons";
let connectionNumber = getQueryArg(window.location.href, "connectionNumber");
const tenantId = getQueryArg(window.location.href, "tenantId");
const serviceType = getQueryArg(window.location.href, "service");

class WorkFlowContainer extends React.Component {
  state = {
    open: false,
    action: "",
    applicationId : "",
    applicationStatus : "",
    WaterConnectionObj: [],
  };

  componentDidMount = async () => {
    let queryObject = [{ key: "tenantId", value: tenantId }, { key: "connectionNumber", value: connectionNumber }];
    let payloadData = await getSearchResults(queryObject);

    const {WaterConnection} =await  payloadData
    if(WaterConnection && WaterConnection.length > 0){
      const {applicationNo,applicationStatus} = WaterConnection[0]
      this.setState({applicationId : applicationNo , applicationStatus,WaterConnectionObj:WaterConnection});
    }
  }

  getRedirectUrl = (action, businessId, moduleName,ActionType) => {

    const isAlreadyEdited = getQueryArg(window.location.href, "edited");
    const tenant = getQueryArg(window.location.href, "tenantId");
    
    let baseUrl = "";
    let bservice = "";
    if (moduleName === "NewWS1" 
        || moduleName === "REGULARWSCONNECTION"
        || moduleName === "TEMPORARY_WSCONNECTION"
        || moduleName === "WS_TEMP_TEMP" 
        ||moduleName === "WS_TEMP_REGULAR"
        ||moduleName === "WS_DISCONNECTION" 
        ||moduleName === "WS_TEMP_DISCONNECTION"
        || moduleName === "WS_RENAME" 
        || moduleName === "WS_CONVERSION" 
        || moduleName === "WS_REACTIVATE" 
        || moduleName === "WS_TUBEWELL") {
      baseUrl = "wns"
      if (moduleName === "NewWS1" 
      || moduleName === "REGULARWSCONNECTION" 
      || moduleName === "TEMPORARY_WSCONNECTION"
        || moduleName === "WS_TEMP_TEMP" 
        ||moduleName === "WS_TEMP_REGULAR"
        ||moduleName === "WS_DISCONNECTION" 
        ||moduleName === "WS_TEMP_DISCONNECTION"
        || moduleName === "WS_RENAME" 
        || moduleName === "WS_CONVERSION" 
        || moduleName === "WS_REACTIVATE"
      || moduleName === "WS_TUBEWELL") {
        bservice = "WS.ONE_TIME_FEE"
      } else {
        bservice = "SW.ONE_TIME_FEE"
      }
    }
  
    switch (action) {

      case "EDIT": return isAlreadyEdited
        ? `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&edited=trueservice=WATER&actionType=${ActionType}`
        : `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=editservice=WATER&actionType=${ActionType}`;
        case "WATERMODIFY":
          return isAlreadyEdited
          ? `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&edited=true&service=WATER&actionType=${ActionType}`
          : `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&service=WATER&actionType=${ActionType}`;
    }
  };


  // getHeaderName = action => {
  //   return {
  //     labelName: `${action} Application`,
  //     labelKey: `WF_${action}_APPLICATION`
  //   };
  // };

  // getEmployeeRoles = (nextAction, currentAction, moduleName) => {
  //   const businessServiceData = JSON.parse(
  //     localStorageGet("businessServiceData")
  //   );
  //   const data = find(businessServiceData, { businessService: moduleName });
  //   let roles = [];
  //   if (nextAction === currentAction) {
  //     data.states &&
  //       data.states.forEach(state => {
  //         state.actions &&
  //           state.actions.forEach(action => {
  //             roles = [...roles, ...action.roles];
  //           });
  //       });
  //   } else {
  //     const states = find(data.states, { uuid: nextAction });
  //     states &&
  //       states.actions &&
  //       states.actions.forEach(action => {
  //         roles = [...roles, ...action.roles];
  //       });
  //   }
  //   roles = [...new Set(roles)];
  //   roles.indexOf("*") > -1 && roles.splice(roles.indexOf("*"), 1);
  //   return roles.toString();
  // };




  getActionIfEditable = (status, businessId, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: moduleName });
    const state = find(data.states, { applicationStatus: status });
    let actions = [];
    state.actions &&
      state.actions.forEach(item => {
        actions = [...actions, ...item.roles];
      });
    const userRoles = JSON.parse(getUserInfo()).roles;
    const roleIndex = userRoles.findIndex(item => {
      if (actions.indexOf(item.code) > -1) return true;
    });

    let editAction = {};
    if (state.isStateUpdatable && actions.length > 0 && roleIndex > -1) {
      editAction = {
        buttonLabel: "EDIT",
        moduleName: moduleName,
        tenantId: state.tenantId,
        isLast: true,
        buttonUrl: this.getRedirectUrl("EDIT", businessId, moduleName)
      };
    }
    return editAction;
  };
  getWNSButtonForCitizen = (preparedFinalObject, status, businessId, moduleName) =>{   
   // const btnName = ["Apply for Regular Connection","Reactivate Connection","Connection Conversion","Temporary Disconnection","Permanent Disconnection"]
    const btnName = [
      "PERMANENT_DISCONNECTION" //R
      ,"TEMPORARY_DISCONNECTION"
      ,"UPDATE_CONNECTION_HOLDER_INFO"
      ,"CONNECTION_CONVERSION"//R
      ,"REACTIVATE_CONNECTION" //tep close
      ,"APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION"//T
      ,"APPLY_FOR_TEMPORARY_REGULAR_CONNECTION"];
        

      let actions  = btnName.map(btn => {

        if(preparedFinalObject)
        {
          //set module based on subactivity if new subactivity added the required change
          const WaterConnection = preparedFinalObject;
            if(WaterConnection.length>0)
            {
            switch(WaterConnection[0].activityType)
            {
              case'APPLY_FOR_TEMPORARY_CONNECTION':
              case 'APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION':
              case 'APPLY_FOR_TEMPORARY_REGULAR_CONNECTION':
              moduleName ='TEMPORARY_WSCONNECTION'
              break;
              case "NEW_WS_CONNECTION":
              moduleName ="REGULARWSCONNECTION"
              break;
            }
          }
        }
        // const btnName = ["UPDATE_CONNECTION_HOLDER_INFO",
        // "TEMPORARY_DISCONNECTION",
        // "CONNECTION_CONVERSION",
        // "PERMANENT_DISCONNECTION",
        // "REACTIVATE_CONNECTION",
        // "APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION",
        // "APPLY_FOR_TEMPORARY_REGULAR_CONNECTION"];
        // if(btnName.includes(btn))
        //    moduleName = btn;
              const buttonObj = {
                buttonLabel: btn,
                moduleName: moduleName,
                tenantId: "ch.chandigarh",
                isLast: true,
                buttonUrl: this.getRedirectUrl("WATERMODIFY", businessId, moduleName,btn)
              }

              return buttonObj;
            });

            //logic based on conditions  preparedFinalObject
            // filer subactivity in tacke acion button in connection details page
            const WaterConnection = preparedFinalObject;
            let inWorkflow = false ;
            inWorkflow = WaterConnection.length>0 && WaterConnection[0].inWorkflow;
            const connectionUsagesType = WaterConnection.length>0 && WaterConnection[0].connectionUsagesType;
            if(inWorkflow){
              actions = [];
            }
           // else if(status === "CONNECTION_ACTIVATED" && WaterConnection[0].waterApplicationType==='REGULAR')
           else if((status == "CONNECTION_ACTIVATED"|| status == "NA") && WaterConnection[0].waterApplicationType==='REGULAR')
            {
              actions = actions.filter(item => item.buttonLabel !== 'APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION' 
                                              && item.buttonLabel !=='REACTIVATE_CONNECTION'
                                              &&  item.buttonLabel !== 'APPLY_FOR_TEMPORARY_REGULAR_CONNECTION');
            }
            //else if(status === "CONNECTION_ACTIVATED" && WaterConnection[0].waterApplicationType ==='TEMPORARY')
            else if((status === "CONNECTION_ACTIVATED" || status == "NA")&& WaterConnection[0].waterApplicationType ==='TEMPORARY')
            {
              actions = actions.filter(item => item.buttonLabel !== 'PERMANENT_DISCONNECTION' 
                                                &&  item.buttonLabel !== 'TEMPORARY_DISCONNECTION'
                                                && item.buttonLabel !=='REACTIVATE_CONNECTION'
                                                &&  item.buttonLabel !== 'UPDATE_CONNECTION_HOLDER_INFO'
                                                &&  item.buttonLabel !== 'CONNECTION_CONVERSION');
            }
            // else if(status === "PENDING_FOR_REGULAR_CONNECTION"){//remove
            //   actions = actions.filter(item => item.buttonLabel === 'APPLY_FOR_REGULAR_INFO'); 
            // }
            else if(status === "TEMPORARY_DISCONNECTED"){
              //actions = actions.filter(item => item.buttonLabel === 'REACTIVATE_CONNECTION'); 
              actions = actions.filter(item => item.buttonLabel === "TEMPORARY_CONNECTION_CLOSED"); 
            }
            // else if (moduleName === "WS_TUBEWELL"){
            //   actions = actions.filter(item => item.buttonLabel === 'UPDATE_CONNECTION_HOLDER_INFO');
            // }
            // else if(connectionUsagesType && connectionUsagesType==="COMMERCIAL"){
            //   actions = actions.filter(item => item.buttonLabel !== 'REACTIVATE_CONNECTION' && item.buttonLabel !== 'CONNECTION_CONVERSION'&& item.buttonLabel !== 'APPLY_FOR_REGULAR_INFO'); 
            // } 
            // else if(status !== "" && WaterConnection[0].waterApplicationType==='REGULAR' )
            // {
            //   actions = actions.filter(item => item.buttonLabel !== 'APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION' 
            //                                      &&  item.buttonLabel !== 'APPLY_FOR_TEMPORARY_REGULAR_CONNECTION'
            //                                      && item.buttonLabel !=='PERMANENT_DISCONNECTION'
            //                                      &&  item.buttonLabel !== 'TEMPORARY_DISCONNECTION'
            //                                     &&  item.buttonLabel !== 'REACTIVATE_CONNECTION'
            //                                     &&  item.buttonLabel !== 'UPDATE_CONNECTION_HOLDER_INFO'
            //                                     &&  item.buttonLabel !== 'CONNECTION_CONVERSION');

            // }
            else if(((status === "TEMPORARY_CONNECTION_CLOSED" || status ==='TEMPORARY_DISCONNECTED')  || (status ==='REJECTED')) && WaterConnection[0].waterApplicationType==='REGULAR' )//TEMPORARY_CONNECTION_CLOSED
            {
              if(WaterConnection[0].activityType==='REACTIVATE_CONNECTION' )
              actions = actions.filter(item => item.buttonLabel === 'REACTIVATE_CONNECTION');
              else{
                actions = actions.filter(item => item.buttonLabel === 'REACTIVATE_CONNECTION');

              }

            }
            // else {
            //   actions = actions.filter(item => item.buttonLabel !== 'REACTIVATE_CONNECTION' && item.buttonLabel !== 'APPLY_FOR_REGULAR_INFO'); 
            // }

    return actions;
}
  prepareWorkflowContract = ( moduleName) => {
    const {
      getWNSButtonForCitizen
    } = this;
    const {applicationId,applicationStatus:stat,WaterConnectionObj} = this.state;
    console.log("workflow", applicationId , stat)
    let actions =[];
    const {preparedFinalObject} = this.props;
    const WaterConnection = WaterConnectionObj;
    const applicationStatus = stat;
    const businessId = applicationId;
      const userRoles = JSON.parse(getUserInfo()).roles;
      const roleIndex = userRoles.some(item => item.code ==="CITIZEN" || item.code=== "WS_CEMP" );
      const isButtonPresent =  window.localStorage.getItem("WNS_STATUS") || false;
      if(roleIndex && !isButtonPresent && serviceType !== "SEWERAGE"){
        const buttonArray = getWNSButtonForCitizen(WaterConnection, applicationStatus, businessId,"REGULARWSCONNECTION");
       actions = actions.concat(buttonArray);
      }
        
    return actions;
  };



  render() {
    const {
      prepareFinalObject,
      dataPath,
      moduleName
    } = this.props;
    const workflowContract =  this.prepareWorkflowContract( moduleName);
     let showFooter;
      if(moduleName==='NewWS1'
      || moduleName==='REGULARWSCONNECTION'
      || moduleName==='SW_SEWERAGE'
      || moduleName === 'TEMPORARY_WSCONNECTION'
      || moduleName ==='WS_TEMP_TEMP'
      || moduleName ==='WS_TEMP_REGULAR'
      || moduleName === "WS_CONVERSION" 
      || moduleName === "WS_DISCONNECTION" 
      || moduleName === "WS_TEMP_DISCONNECTION"
      || moduleName ==="WS_REACTIVATE"
      || moduleName === "WS_RENAME" 
      || moduleName === "WS_TUBEWELL"){
         showFooter=true;
      }    else{
         showFooter=process.env.REACT_APP_NAME === "Citizen" ? false : true;
      }
    return (
      <div>
        {showFooter &&
          <Footer
            handleFieldChange={prepareFinalObject}
            variant={"contained"}
            color={"primary"}
            contractData={workflowContract}
            dataPath={dataPath}
            moduleName={moduleName}
          />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  return {  preparedFinalObject };
};

const mapDispacthToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value)),
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant)),
    setRoute: route => dispatch(setRoute(route))
  };
};

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(WorkFlowContainer);
