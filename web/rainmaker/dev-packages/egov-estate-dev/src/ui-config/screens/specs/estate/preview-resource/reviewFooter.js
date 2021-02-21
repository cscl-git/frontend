import {
    getLabel,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
    getButtonVisibility,
    getCommonApplyFooter
  } from "../../utils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import {
    toggleSnackbar
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getBill, validateFields } from "../../utils";
  import get from "lodash/get";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  localStorageGet,
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";

  export const footerReview = (
    action,
    state,
    dispatch,
    status,
    applicationNumber,
    tenantId,
    businessService,
    branchType,
    userRole
  ) => {
    /** MenuButton data based on status */
    
    return getCommonApplyFooter({
      container: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        children: {
          rightdiv: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
              style: {
              float:"right",
              display:"flex"
              }
            },
            children: {
              makePayment: {
                componentPath: "Button",
                props: {
                  variant: "contained",
                  color: "primary",
                  style: {
                    minWidth: "180px",
                    height: "48px",
                    marginRight: "45px",
                    borderRadius: "inherit"
                  },
                  className: "make-payment-footer-button"
                },
                children: {
                  submitButtonLabel: getLabel({
                    labelName: "MAKE PAYMENT",
                    labelKey: "COMMON_MAKE_PAYMENT"
                  })
                },
                onClickDefination: {
                  action: "condition",
                  callBack: async() => {
                    const queryObj = [
                      {
                        key: "tenantId",
                        value: tenantId
                      },
                      {
                        key: "consumerCode",
                        value: applicationNumber
                      },
                      {
                        key: "businessService",
                        value: businessService
                      }
                    ];
                  
                  const billPayload = await getBill(queryObj);
                  // debugger
                  console.log(billPayload);
                
                  const taxAmount = Number(get(billPayload, "Bill[0].totalAmount"));
                    if(taxAmount === 0){
                      dispatch(toggleSnackbar(
                        true,
                        {
                          labelName: "Amount already Paid !",
                          labelKey: "ES_ERR_FEE_AMOUNT_PAID"
                        },
                        "error"
                      ));
                    }
                    else{
                      dispatch(
                        setRoute(
                         `/estate-citizen/pay?consumerCode=${applicationNumber}&tenantId=${tenantId}&businessService=${businessService}`
                        )
                      );
                    }
                    
                  },
  
                },
                visible: process.env.REACT_APP_NAME === "Citizen"  && getButtonVisibility(status, "PENDINGPAYMENT", JSON.parse(getUserInfo()).roles[0].code) ? true : false
              },
              uploadDocument: {
                componentPath: "Button",
                props: {
                  variant: "contained",
                  color: "primary",
                  style: {
                    minWidth: "180px",
                    height: "48px",
                    marginRight: "45px",
                    borderRadius: "inherit"
                  }
                },
                children: {
                  submitButtonLabel: getLabel({
                    labelName: "UPLOAD DOCUMENTS",
                    labelKey: "ES_UPLOAD_DOCUMENTS"
                  })
                },
                onClickDefination: {
                  action: "condition",
                  callBack: () => {
                    dispatch(prepareFinalObject("ResubmitAction", true))
                  },
                },
                visible: process.env.REACT_APP_NAME === "Citizen"  && getButtonVisibility(status, "UPLOAD_DOCUMENT") ? true : false
              },
              offlinePayment: {
                componentPath: "Button",
                props: {
                  variant: "contained",
                  color: "primary",
                  style: {
                    minWidth: "180px",
                    height: "48px",
                    marginRight: "45px",
                    borderRadius: "inherit"
                  }
                },
                children: {
                  submitButtonLabel: getLabel({
                    labelName: "MAKE PAYMENT",
                    labelKey: "COMMON_MAKE_PAYMENT"
                  })
                },
                onClickDefination: {
                  action: "condition",
                  callBack: async() => {
                    const queryObj = [
                      {
                        key: "tenantId",
                        value: tenantId
                      },
                      {
                        key: "consumerCode",
                        value: applicationNumber
                      },
                      {
                        key: "businessService",
                        value: businessService
                      }
                    ];
                  
                  const billPayload = await getBill(queryObj);
                  // debugger
                  console.log(billPayload);
                
                  const taxAmount = Number(get(billPayload, "Bill[0].totalAmount"));
                    if(taxAmount === 100){
                      dispatch(toggleSnackbar(
                        true,
                        {
                          labelName: "Amount already Paid !",
                          labelKey: "ES_ERR_FEE_AMOUNT_PAID"
                        },
                        "error"
                      ));
                    }
                    else{
                      dispatch(
                        setRoute(
                         `/estate/pay?consumerCode=${applicationNumber}&tenantId=${tenantId}&businessService=${businessService}`
                        )
                      );
                    }
                  },
                },
                visible: process.env.REACT_APP_NAME === "Employee" && getButtonVisibility(status, "PENDINGPAYMENT", JSON.parse(getUserInfo()).roles[0].code) ? true : false
              },
              nocVerification: {
                componentPath: "Button",
                props: {
                  variant: "contained",
                  color: "primary",
                  style: {
                    minWidth: "180px",
                    height: "60px",
                    marginRight: "45px",
                    borderRadius: "inherit"
                  }
                },
                children: {
                  submitButtonLabel: getLabel({
                    labelName: "NOC Verification",
                    labelKey: "ES_NOC_VERIFICATION"
                  })
                },
                onClickDefination: {
                  action: "condition",
                  callBack: () => {
                    dispatch(
                      setRoute(
                       `/estate/noc-verification?applicationNumber=${applicationNumber}&tenantId=${tenantId}&branchType=${branchType}`
                      )
                    );
                  },
                },
                visible: process.env.REACT_APP_NAME === "Employee" && getButtonVisibility(status, "NOCVERIFICATION") ? true : false
              },
              siteReport: {
                componentPath: "Button",
                props: {
                  variant: "contained",
                  color: "primary",
                  style: {
                    minWidth: "180px",
                    height: "60px",
                    marginRight: "45px",
                    borderRadius: "inherit"
                  }
                },
                children: {
                  siteReportButtonLabel: getLabel({
                    labelName: "Site Report",
                    labelKey: "ES_SITE_REPORT"
                  }),
                  nextIcon: {
                    uiFramework: "custom-atoms",
                    componentPath: "Icon",
                    props: {
                      iconName: "keyboard_arrow_right"
                    }
                  }
                },
                onClickDefination: {
                  action: "condition",
                  callBack: () => {
                    dispatch(
                      setRoute(
                       `/estate/site-report?applicationNumber=${applicationNumber}&tenantId=${tenantId}&branchType=${branchType}`
                      )
                    );
                  },
                },
                visible: process.env.REACT_APP_NAME === "Employee" && getButtonVisibility(status, "SITEREPORT", JSON.parse(getUserInfo()).roles[0].code) ? true : false
              }
            },
            gridDefination: {
              xs: 12,
              sm: 12
            }
          },     
        }
      }
    });
  };