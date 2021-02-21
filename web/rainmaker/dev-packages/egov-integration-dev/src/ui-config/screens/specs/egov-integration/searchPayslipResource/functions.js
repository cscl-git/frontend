import get from "lodash/get";
import find from "lodash/find";
import {
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
  toggleSpinner,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults ,getprintpdf,downloadReceiptFromFilestoreID} from "../../../../../ui-utils/commons";
//import { getprintpdf } from "../../../../ui-utils/storecommonsapi";
import { getTextToLocalMapping } from "./searchResults";
import { validateFields,convertDateToEpoch } from "../../utils";
import { httpRequest } from "../../../../../ui-utils";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import set from "lodash/set";
import {  
  samplePaySlip
  } from "../../../../../ui-utils/sampleResponses";
export const searchApiCall = async (state, dispatch) => {
  let { localisationLabels } = state.app || {};
 // showHideTable(false, dispatch);
  const tenantId = "ch.chandigarh" // process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;

  let queryObject = [];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchFormValid = validateFields(
    "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children",
    state,
    dispatch,
    "payslipsearch"
  );

  if (!isSearchFormValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill all required field",
          labelKey: "ERROR_FILL_ALL_VALID_FIELDS",
        },
        "warning"
      )
    );
  }  
  else {
    // Add selected search fields to queryobject
    // for (var key in searchScreenObject) {      
      
    //     queryObject.push({ key: key, value: searchScreenObject[key] });
      
    // }
 // let hrmsRequest = {...searchScreenObject};
   //NulmSuhRequest.tenantId = tenantId;
   const requestBody = {
    hrmsRequest:{
      empCode:searchScreenObject.empCode,
      month:searchScreenObject.month,
      year:searchScreenObject.year,
    }
  }
  dispatch(toggleSpinner())
  let response = await getSearchResults([],requestBody, dispatch, "getpayslip");
    // dispatch(prepareFinalObject("RecordSet", response.ResponseBody[0].RecordSet));
       // FROM local
       let  APIData = [];//samplePaySlip();

       if(response)
       {
        APIData = get(response,"ResponseBody.MCPaySlip",{})
       }
       // from api
 if(!APIData.PaySlip.NoRecordFound)
 {
  let Allowances =[];
  let Deductions = [];
  let Allowances_total =0
  let Deductions_total =0
  let Allowances_Deductions=[];
  let ItemType = APIData.PaySlip.Allowances_Deductions.ItemType
  let Value = APIData.PaySlip.Allowances_Deductions.Value
  let ItemName = APIData.PaySlip.Allowances_Deductions.ItemName
  if(ItemType.length>0)
  {
    for (let index = 0; index <ItemType.length; index++) {
      const element = ItemType[index];
      const Value_ = Value[index];
      const ItemName_ = ItemName[index];
      // Allowances_Deductions.push(
      //   {
      //     code:element,
      //     Value:Value_,
      //     ItemName:ItemName_
      //   }
      // )
      if(element ==="A")
      {
        Allowances.push(
        {
          code:element,
          Value:Value_,
          ItemName:ItemName_
        }
      )
      Allowances_total = Allowances_total+ Value_
      }
      else if(element ==="D")
      {
        Deductions.push(
        {
          code:element,
          Value:Value_,
          ItemName:ItemName_
        }
      )
      Deductions_total = Deductions_total+ Value_
      }          
    }        
  }
  
if(Allowances.length>Deductions.length)
  for (let index = 0; index < Allowances.length; index++) {
    const Allowances_ = Allowances[index];
    const Deductions_ = Deductions[index];
    
    Allowances_Deductions.push(
      {
        Allowances_Text: Allowances_ !== undefined? Allowances_.ItemName :'',
        Allowances_Amount:Allowances_ !== undefined? Allowances_.Value :'',
        Deductions_Text: Deductions_!== undefined? Deductions_.ItemName :'',
        Deductions_Amount:Deductions_!== undefined? Deductions_.Value :'',
      } 
    )       
  }
  else if(Allowances.length<Deductions.length)
  for (let index = 0; index < Deductions.length; index++) {
    const Allowances_ = Allowances[index];
    const Deductions_ = Deductions[index];
    Allowances_Deductions.push(
      {
        Allowances_Text: Allowances_ !== undefined? Allowances_.ItemName :'',
        Allowances_Amount:Allowances_ !== undefined? Allowances_.Value :'',
        Deductions_Text: Deductions_!== undefined? Deductions_.ItemName :'',
        Deductions_Amount:Deductions_!== undefined? Deductions_.Value :'',
      } 
    )       
  }
  else{
    for (let index = 0; index < Allowances.length; index++) {
      const Allowances_ = Allowances[index];
      const Deductions_ = Deductions[index];
      Allowances_Deductions.push(
        {
          Allowances_Text: Allowances_ !== undefined? Allowances_.ItemName :'',
          Allowances_Amount:Allowances_ !== undefined? Allowances_.Value :'',
          Deductions_Text: Deductions_!== undefined? Deductions_.ItemName :'',
          Deductions_Amount:Deductions_!== undefined? Deductions_.Value :'',
        } 
      )       
    }

  }
  
  Allowances_Deductions.push(
    {
      Allowances_Text: 'Total Allowances',
      Allowances_Amount:Allowances_total,
      Deductions_Text: 'Total Deductions',
      Deductions_Amount:Deductions_total,
    }
  )
  Allowances_Deductions.push(
    {
      Allowances_Text: '',
      Allowances_Amount:'',
      Deductions_Text: 'Net Pay',
      Deductions_Amount:Allowances_total - Deductions_total,
    }
  )
  let PaySlip ={
    //Deductions:Deductions,

    Allowances:Allowances_Deductions,
    Designation:APIData.PaySlip.Designation,
    EmployeeCode:APIData.PaySlip.EmployeeCode,
    DDOName:APIData.PaySlip.DDOName,
    DDOCode:APIData.PaySlip.DDOCode,
    PayScale:APIData.PaySlip.PayScale,
    PayCommission:APIData.PaySlip.PayCommission,
    Name:APIData.PaySlip.Name,
    FatherName:APIData.PaySlip.FatherName,
  }
 // dispatch(prepareFinalObject("PaySlip",PaySlip));
  dispatch(prepareFinalObject("APIData.PaySlip",PaySlip));
  dispatch(
    handleField(
      "payslipsearch",
      "components.div.children.footer.children.SubmitButton",
      "visible",
      true
    )
  );

 }
 else
 {
  //dispatch(prepareFinalObject("APIData.PaySlip",{}));
  
  dispatch(prepareFinalObject("APIData.PaySlip.EmployeeCode",''));
  dispatch(prepareFinalObject("APIData.PaySlip.Name",));
  dispatch(prepareFinalObject("APIData.PaySlip.FatherName",));
  dispatch(prepareFinalObject("APIData.PaySlip.Designation",));
  dispatch(prepareFinalObject("APIData.PaySlip.DDOName",));

  dispatch(prepareFinalObject("APIData.PaySlip.Allowances",[]));
  dispatch(
        toggleSnackbar(
          true,
          { labelName: APIData.PaySlip.NoRecordFound },
          "warning"
        )
      );


 }
 dispatch(toggleSpinner())
   
  }
};

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "payslipsearch",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
export const payslipDownloadApiCall = async (state, dispatch) => {  
  downloadAcknowledgementForm(state);
 // let id = getQueryArg(window.location.href, "id");
 

  // try {
  //   let payload = null;     
  //   payload = await httpRequest(
  //     "post",
  //     "/integration-services/pt/v1/_print",
  //     "",
  //     [],
  //     WFBody
  //   );

    
  //   dispatch(toggleSnackbar(
  //     true,
  //     { labelName: "succcess ", labelKey: "WS_SUCCESS" },
  //     "success"
  //   ))

  // } catch (error) {      
    
  //     dispatch(toggleSnackbar(
  //       true,
  //       { labelName: error.message, labelKey: error.message },
  //       "error"
  //     ));
  //    // moveToSuccess("INITIATED",dispatch)
  // }

  }

  export const downloadAcknowledgementForm = async (state ,mode="download") => {
    let tenantId =  getTenantId();
    let APIUrl =`/pdf-service/v1/_create?key=payslip&tenantId=${tenantId}`
    //let ApplicationNo ='';
    const PayslipRequest = get(state.screenConfiguration.preparedFinalObject.APIData, "PaySlip",[]);
    let WFBody = {
      PayslipRequest :[PayslipRequest]
      
      
    //   PayslipRequest:[{
    //     empCode:PaySlip.EmployeeCode,
    //     name:PaySlip.Name,
    //     fatherName:PaySlip.FatherName,
    //     designation:PaySlip.Designation,
    //     department:PaySlip.DDOName,
    //     basicPay:PaySlip.Allowances[0].Allowances_Text,
    //     dearnessAllowance:PaySlip.Allowances[0].Allowances_Text,
    //     gisUT:PaySlip.asd,
    //     incomeTax:PaySlip.asd,
    //     cityCompensatoryAllowance:PaySlip.Allowances[0].Allowances_Text,
    //     licencesFee:PaySlip.asd,
    //     medicalAllowance:PaySlip.Allowances[5].Allowances_Amount,
    //     specialAllowance:PaySlip.Allowances[5].Allowances_Amount,
    //     IRUTPBHP:PaySlip.Allowances[5].Allowances_Amount,
    //     totalAllowances:PaySlip.Allowances[6].Allowances_Amount,
    //     totalDeductions:PaySlip.Allowances[6].Deductions_Amount,
    //     netPay:PaySlip.Allowances[7].Deductions_Amount,

    //   }
    // ]
         
    };
  // switch(pagename)
  // {
  //   case "Indent":
  //     ApplicationNo = getQueryArg(window.location.href, "applicationNumber");
  //     queryObject.push({
  //       key: "indentNumber",
  //       value:ApplicationNo
  //     });
  //     queryObject.push({
  //       key: "indentType",
  //       value:"Indent"
  //     });
  //     APIUrl = `store-asset-services/indents/_print`
  //     break;     
  
  // }
      
      try {    
        const response = await getprintpdf(WFBody,APIUrl);
        if(response)
        {
          let filestoreId = response.filestoreIds[0]
          downloadReceiptFromFilestoreID(filestoreId,mode,tenantId)
        }
       
      } catch (exception) {
        alert('Some Error Occured while downloading Acknowledgement form!');
      }
    
    }
