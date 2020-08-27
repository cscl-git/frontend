import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getSearchResults } from "../../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import{GetMdmsNameBycode,getMaterialBalanceRateResults} from '../../../../../ui-utils/storecommonsapi'
import get from "lodash/get";
export const MTONHeader = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Material Transfer Outward",
      labelKey: "STORE_MTON_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  MTONHeaderContainer: getCommonContainer({

    transferIndentNo: {
      ...getSelectField({
        label: { labelName: "Transfer Indent No.", labelKey: "STORE_MTON_INDENT_NUMBER" },
        placeholder: {
          labelName: "Select Transfer Indent No.",
          labelKey: "STORE_MTON_INDENT_NUMBER_SELECT"
        },
        jsonPath: "materialIssues[0].indent.id",
        required: true,
       sourceJsonPath: "TransferIndent.indents",
        props: {
          className: "hr-generic-selectfield",
          optionValue: "id",
          optionLabel: "indentNumber",
        }
      }),
      beforeFieldChange: (action, state, dispatch) => {
        let indents = get(state, "screenConfiguration.preparedFinalObject.TransferIndent.indents",[]) 
        indents = indents.filter(x=>x.id === action.value);
        let storecode = '';
        if(indents && indents[0])
        {
          
          dispatch(prepareFinalObject("materialIssues[0].indent.indentNumber", indents[0].indentNumber));
          dispatch(prepareFinalObject("materialIssues[0].indent.tenantId", getTenantId()));
          dispatch(prepareFinalObject("materialIssues[0].indent.indentDate", indents[0].indentDate));
          dispatch(prepareFinalObject("materialIssues[0].indent.issueStore.code", indents[0].issueStore.code));
          dispatch(prepareFinalObject("materialIssues[0].indent.issueStore.name", indents[0].issueStore.name));
          dispatch(prepareFinalObject("materialIssues[0].toStore.name", indents[0].indentStore.name));
          dispatch(prepareFinalObject("materialIssues[0].toStore.code", indents[0].indentStore.code)); 
          dispatch(prepareFinalObject("materialIssues[0].indent.indentStore.code", indents[0].indentStore.code));
          dispatch(prepareFinalObject("materialIssues[0].indent.indentStore.name", indents[0].indentStore.name));
          dispatch(prepareFinalObject("materialIssues[0].fromStore.name", indents[0].issueStore.name));
          dispatch(prepareFinalObject("materialIssues[0].fromStore.code", indents[0].issueStore.code));
          dispatch(prepareFinalObject("materialIssues[0].indent.indentType", indents[0].indentType));
          dispatch(prepareFinalObject("materialIssues[0].indent.indentPurpose", indents[0].indentPurpose));
          dispatch(prepareFinalObject("materialIssues[0].indent.indentCreatedBy", indents[0].indentCreatedBy));
          dispatch(prepareFinalObject("materialIssues[0].indent.designation", indents[0].inddesignationentNumberme));
          storecode =indents[0].issueStore.code;
          let indentDetails = get(
            indents[0],
            "indentDetails",
            []
          );
          let material=[];
          let matcode =[];
          for (let index = 0; index < indentDetails.length; index++) {
            const element = indentDetails[index];

            dispatch(prepareFinalObject(`materialIssues[0].indent.indentDetails[${index}].id`, element.id));
            dispatch(prepareFinalObject(`materialIssues[0].indent.indentDetails[${index}].uom.code`, element.uom.code));
            dispatch(prepareFinalObject(`materialIssues[0].indent.indentDetails[${index}].userQuantity`, element.userQuantity));
            dispatch(prepareFinalObject(`materialIssues[0].indent.indentDetails[${index}].material.code`, element.material.code));
            //create material list for card item
           
            material.push(
              {
                materialcode:element.material.code,
                materialName:GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",element.material.code),
                uomcode:element.uom.code,
                uomname:GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.common-masters.UOM",element.uom.code),
                id:element.id,
                indentQuantity:element.indentQuantity,
                totalProcessedQuantity:element.totalProcessedQuantity,
                indentIssuedQuantity:element.indentIssuedQuantity,
                interstoreRequestQuantity:element.interstoreRequestQuantity,
                //unitRate://to be deside
              });
              matcode.push( element.material.code)
          }  
          
          let matcodes_= matcode.map(itm => {
            return `${itm}`;
          })
          .join() || "-"
          const queryObject = [{ key: "tenantId", value: getTenantId()},{ key: "issueingStore", value: storecode},{ key: "material", value: matcodes_}];
          getMaterialBalanceRateResults(queryObject)
          .then(async response =>{
            if(response){
              dispatch(prepareFinalObject("indentsOutmaterial", response.MaterialBalanceRate));
              
            }
          }); 
        }
      }
    },
    issueDate: {
      ...getDateField({
        label: {
          labelName: "Issue Date",
          labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_DATE",
        },
        placeholder: {
          labelName: "Enter Issue Date",
          labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_DATE_PLACEHOLDER",
        },
        required: true,
        pattern: getPattern("Date"),
        jsonPath: "materialIssues[0].issueDate",
        props: {
          inputProps: {
            max: new Date().toISOString().slice(0, 10),
          }
        }
      }),
    },  
    issuingStoreName: {
      ...getSelectField({
        label: { labelName: "Issuing Store Name", labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUING_STORE_NAME" },
        placeholder: {
          labelName: "Select Issuing Store Name",
          labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUING_STORE_NAME_SELECT"
        },
        jsonPath: "materialIssues[0].toStore.code",
        sourceJsonPath: "store.stores",
        props: {
          disabled:true,
          className: "hr-generic-selectfield",
          optionValue: "code",
          optionLabel: "name",
        }
      }),
    },
    indentDate: {
      ...getDateField({
        label: {
          labelName: "Indent Date",
          labelKey: "STORE_MATERIAL_INDENT_INDENT_DATE",
        },
        placeholder: {
          labelName: "Indent Date",
          labelKey: "STORE_MATERIAL_INDENT_INDENT_DATE",
        },
        pattern: getPattern("Date"),
        jsonPath: "materialIssues[0].indent.indentDate",
        props: {
          disabled:true,
          inputProps: {
            max: new Date().toISOString().slice(0, 10),
          }
        }
      }),
    },  
    indentingStore: {
      ...getSelectField({
        label: { labelName: "Indenting Store", labelKey: "STORE_MATERIAL_INDENT_NOTE_INDENTING_STORE" },
        placeholder: {
          labelName: "Select Store Name",
          labelKey: "STORE_DETAILS_STORE_NAME_SELECT"
        },
        jsonPath: "materialIssues[0].fromStore.code",
        sourceJsonPath: "store.stores",
        props: {
          disabled:true,
          className: "hr-generic-selectfield",
          optionValue: "code",
          optionLabel: "name",
        }
      }),
    },
    indentDeptName: {
      ...getTextField({
        label: {
          labelName: "Indenting Dept. Name",
          labelKey: "STORE_MTON_INDENT_DEPT_NAME"
        },
        placeholder: {
          labelName: "Enter Indenting Dept. Name",
          labelKey: "STORE_MTON_INDENT_DEPT_NAME_PLCEHLDER"
        },
        visible:false,
        props: {
          disabled: true
        },
       // pattern: getPattern("Email"),
        jsonPath: "materialIssues[0].createdBy"
      })
    },
    indentPurpose: {
      ...getTextField({
        label: { labelName: "Indent Purpose", labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE" },
        placeholder: {
          labelName: "Indent Purpose",
          labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE"
        },
        required: false,
        jsonPath: "materialIssues[0].indent.indentPurpose",
        //sourceJsonPath: "createScreenMdmsData.store-asset.RateType",
        props: {
          disabled:true
        }
      }),
    },
    indentRaisedBy: {
      ...getTextField({
        label: {
          labelName: "Indent Raised By",
          labelKey: "STORE_PURCHASE_ORDER_INDENT_RAISED"
        },
        placeholder: {
          labelName: "Enter Indent Raised By",
          labelKey: "STORE_PURCHASE_ORDER_INDENT_RAISED_HLDER"
        },
        visible:false,
        props: {
          disabled: true
        },
       // pattern: getPattern("Email"),
        jsonPath: "materialIssues[0].createdBy"
      })
    },
    issuedToEmployee: {
      ...getSelectField({
        label: { labelName: "Issued to Employee", labelKey: "STORE_MTON_ISSUED_TO_EMP" },
        placeholder: {
          labelName: "Select Issued to Employee",
          labelKey: "STORE_MTON_ISSUED_TO_EMP_SELECT"
        },
        jsonPath: "materialIssues[0].issuedToEmployee",
        sourceJsonPath: "createScreenMdmsData.employee",
        props: {
          className: "applicant-details-error",
          optionLabel: "name",
          optionValue: "code",
        },
      }),
      beforeFieldChange: (action, state, dispatch) => {
        let emp = get(state, "screenConfiguration.preparedFinalObject.createScreenMdmsData.employee",[]) 
        let designation=action.value ;
        emp = emp.filter(x=>x.code ===action.value)
        let issuedToDesignation =GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.common-masters.Designation",designation) 
        const {designationsById} = state.common;
       // dispatch(prepareFinalObject("materialIssues[0].issuedToDesignation", issuedToDesignation));
     

      }
    },
    designation: {
      ...getTextField({
        label: {
          labelName: "Designation",
          labelKey: "STORE_PURCHASE_ORDER_DSGNTN"
        },
        placeholder: {
          labelName: "Enter Designation",
          labelKey: "STORE_PURCHASE_ORDER_DSGNTN_PLCEHLDER"
        },
        props: {
          disabled: true
        },
       // pattern: getPattern("Email"),
        jsonPath: "materialIssues[0].issuedToDesignation"
      })
    },
    remarks: getTextField({
      label: {
        labelName: "Remarks",
        labelKey: "STORE_PURCHASE_ORDER_REMARK",
      },
      props: {
        className: "applicant-details-error",
        multiline: "multiline",
        rowsMax: 2,
      },
      placeholder: {
        labelName: "Enter Remarks",
        labelKey: "STORE_PURCHASE_ORDER_REMARK_PLCEHLDER",
      },
      pattern: getPattern("alpha-numeric-with-space-and-newline"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "materialIssues[0].description",
    }),
    issuedBy: {
      ...getTextField({
        label: {
          labelName: "Issued by",
          labelKey: "STORE_PURCHASE_ORDER_ISSUEDBY"
        },
        placeholder: {
          labelName: "Enter Issued By",
          labelKey: "STORE_PURCHASE_ORDER_ISSUEDBY_PLCEHLDER"
        },
        visible:false,
        props: {
          disabled: true
        },
       // pattern: getPattern("Email"),
        jsonPath: "materialIssues[0].createdBy"
      })
    },
    designationIssuedEmp: {
      ...getTextField({
        label: {
          labelName: "Designation",
          labelKey: "STORE_PURCHASE_ORDER_DSGNTN"
        },
        placeholder: {
          labelName: "Enter Designation",
          labelKey: "STORE_PURCHASE_ORDER_DSGNTN_PLCEHLDER"
        },
        visible:false,
        props: {
          disabled: true
        },
       // pattern: getPattern("Email"),
        jsonPath: "materialIssues[0].designation"
      })
    },
  })
});

