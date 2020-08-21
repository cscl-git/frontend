import {
    getCommonCard,
    getCommonGrayCard,
    getCommonTitle,
    getSelectField,
    getDateField,
    getTextField,
    getPattern,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import get from "lodash/get";
  import filter from "lodash/filter";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import{getOpeningBalanceSearchResults} from '../../../../../ui-utils/storecommonsapi'
  import{GetMdmsNameBycode} from '../../../../../ui-utils/storecommonsapi'
  const getBalanceQty = async (action, state, dispatch) => {
    const tenantId = getTenantId();
    const storecode = get(state.screenConfiguration.preparedFinalObject,"materialIssues[0].fromStore.code", '' )
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId,
      },
    ];
    queryObject.push({
      key: "storeName",
      value: storecode
    });
  
      
    try {
      let response = await getOpeningBalanceSearchResults(queryObject, dispatch);
      //let c = response.materialReceipt[0].receiptDetails[0].

      let  materialReceipt = response.materialReceipt
      console.log(materialReceipt[0].receiptDetails[0].userAcceptedQty)
      let matcode = get(state.screenConfiguration.preparedFinalObject,"materialIssues[0].indent.indentDetails[0].materialIssueDetails[0].material.code", '' )
      //alert(materialReceipt[0].receiptDetails[0].material.code +'_'+matcode)
      if (matcode === materialReceipt[0].receiptDetails[0].material.code)
      {
       
        //BalanceQty
        dispatch(prepareFinalObject("materialReceipt[0].receiptDetails[0].indentDetail.BalanceQty",materialReceipt[0].receiptDetails[0].userAcceptedQty));
        //materialReceipt[0].receiptDetails[0].indentDetail.UnitPrice
        dispatch(prepareFinalObject("materialReceipt[0].receiptDetails[0].indentDetail.UnitPrice",materialReceipt[0].receiptDetails[0].unitRate));
      }
      else
      {
        dispatch(prepareFinalObject("materialReceipt[0].receiptDetails[0].indentDetail.indentQuantity",0));
      }
      // materialReceipt = materialReceipt.filter(x=>x.receivingStore.code === storecode)
      // console.log(materialReceipt[0])
      
     
      
    } catch (e) {
      console.log(e);
    }
  };
  const arrayCrawler = (arr, n) => {
    if (n == 1) {
      return arr.map(item => {
        return { code: item.code, name: item.name };
      });
    } else
      return arr.map(item => {
        return arrayCrawler(item.children, n - 1);
      });
  };
  
  const materialReceiptCard = {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      scheama: getCommonGrayCard({
        materialReceiptCardContainer: getCommonContainer(
          {

            MaterialName: {
              ...getSelectField({
                label: {
                  labelName: "Material Nmae",
                  labelKey: "STORE_MATERIAL_NAME"
                },
                placeholder: {
                  labelName: "Select Material Name",
                  labelKey: "STORE_MATERIAL_NAME_SELECT"
                },
                required: true,               
                jsonPath: "materialReceipt[0].receiptDetails[0].material.code",
                sourceJsonPath: "MiscMaterilList",
                props: {
                  optionValue: "materialcode",
                  optionLabel: "materialName",
                  // optionValue: "id",
                  // optionLabel: "id",
                },
              }),
              beforeFieldChange: (action, state, dispatch) => {
                let cardIndex = action.componentJsonpath.split("items[")[1].split("]")[0];
                let materials = get(
                  state.screenConfiguration.preparedFinalObject,
                  `MiscMaterilList`,
                  []
                ); 
                materials =  materials.filter(x=> x.materialcode === action.value)  
                if(materials && materials[0]) 
                {
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].material.name`,materials[0].materialName));
               
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].uom.code`,materials[0].uom.code));
                let uomname = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.common-masters.UOM",materials[0].uom.code)
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].uom.name`,uomname)); 
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].qtyIssued`,materials[0].quantityIssued));
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].unitRate`,1));
                // isScrapItem based on purpose selection
                let receiptPurpose = get(state.screenConfiguration.preparedFinalObject,`materialReceipt[0].receiptPurpose`,'')
                if(receiptPurpose ==="SCRAP")
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].isScrapItem`,true));
                else
                dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[0].isScrapItem`,false));
                dispatch(prepareFinalObject(`materialReceipt[0].receivedBy`, materials[0].issuedToEmployee,));
                dispatch(prepareFinalObject(`materialReceipt[0].inspectedBy`, materials[0].issuedToEmployee,));
                dispatch(prepareFinalObject(`materialReceipt[0].designation`, materials[0].issuedToDesignation,));

              }
              dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].purchaseOrderDetail.id`,null));
              dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].receiptDetailsAddnInfo[0].manufactureDate`,''));
              dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].receiptDetailsAddnInfo[0].serialNo`,''));
              dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].receiptDetailsAddnInfo[0].expiryDate`,''));
              dispatch(prepareFinalObject(`materialReceipt[0].receiptDetails[${cardIndex}].receiptDetailsAddnInfo[0].batchNo`,''));
               // dispatch(prepareFinalObject("materialReceipt[0].receiptDetails[0].uom.name",materials[0].name));

              }

            },
            UOMName: {
              ...getTextField({
                label: {
                  labelName: "UOM",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_UOM_NAME"
                },
                placeholder: {
                  labelName: "UOM",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_UOM_NAME"
                },
                props:{
                  disabled:true
                },
                required: false,
                pattern: getPattern("Name") || null,
                jsonPath: "materialReceipt[0].receiptDetails[0].uom.name"
              })
            },
            qtyIssued: {
              ...getTextField({
                label: {
                  labelName: "Qty.  Issued",
                  labelKey: "STORE_MATERIAL_RECEIPT_QTY_ISSUED"
                },
                placeholder: {
                  labelName: "Qty.  Issued",
                  labelKey: "STORE_MATERIAL_RECEIPT_QTY_ISSUED"
                },
                props:{
                  disabled:true
                },
                required: false,
                pattern: getPattern("Name") || null,
                jsonPath: "materialReceipt[0].receiptDetails[0].qtyIssued"
              })
            },
            receivedQty: {
              ...getTextField({
                label: {
                  labelName: "Qty. Received",
                  labelKey: "STORE_MATERIAL_RECEIPT_QTY_RECEIVED"
                },
                placeholder: {
                  labelName: "Enter Qty. Received",
                  labelKey: "STORE_MATERIAL_RECEIPT_QTY_RECEIVED_PLACEHOLDER"
                },
                props:{
                  disabled:false
                },
                required: true,
                pattern: getPattern("Amount") || null,
                jsonPath: "materialReceipt[0].receiptDetails[0].receivedQty"
              }),
              beforeFieldChange: (action, state, dispatch) => {
                dispatch(prepareFinalObject("materialReceipt[0].receiptDetails[0].acceptedQty",Number(action.value)));
                 let unitRate = get(state.screenConfiguration.preparedFinalObject,`materialReceipt[0].receiptDetails[0].unitRate`,0)
                 let totalValue = unitRate * Number(action.value)
                dispatch(prepareFinalObject("materialReceipt[0].receiptDetails[0].totalValue",totalValue));
                     }
            },
            unitRate: {
              ...getTextField({
                label: {
                  labelName: "Unit Rate",
                  labelKey: "STORE_MATERIAL_RECEIPT_UNIT_RATE"
                },
                placeholder: {
                  labelName: "Enter Unit Rate",
                  labelKey: "STORE_MATERIAL_RECEIPT__UNIT_RATE_PLACEHOLDER"
                },
                props:{
                  disabled:false
                },
                required: false,
                pattern: getPattern("Name") || null,
                jsonPath: "materialReceipt[0].receiptDetails[0].unitRate"
              })
            },
            totalValue: {
              ...getTextField({
                label: {
                  labelName: "Total Value",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_TOTAL_VALUE"
                },
                placeholder: {
                  labelName: "Total Value",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_TOTAL_VALUE"
                },
                required: false,
                props:{
                  disabled:false
                },
                pattern: getPattern("Name") || null,
                jsonPath: "materialReceipt[0].receiptDetails[0].totalValue"
              })
            },
            Remark: {
              ...getTextField({
                label: {
                  labelName: "Remark",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK"
                },
                placeholder: {
                  labelName: "Enter Remark",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK_PLACEHOLDER"
                },
                required: true,
                pattern: getPattern("Name") || null,
                jsonPath: "materialReceipt[0].receiptDetails[0].rejectionRemark"
              })
            },

           
           
          },
          {
            style: {
              overflow: "visible"
            }
          }
        )
      }),
      items: [],
      addItemLabel: {
        labelName: "Add ",
        labelKey: "STORE_MATERIAL_COMMON_CARD_ADD"
      },
      headerName: "Material Indent Note",
      headerJsonPath:
        "children.cardContent.children.header.children.head.children.Accessories.props.label",
      sourceJsonPath: "materialReceipt[0].receiptDetails",
      prefixSourceJsonPath:
        "children.cardContent.children.materialReceiptCardContainer.children"
    },
    type: "array"
  };
  
  export const materialReceiptMiscDetail = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Miscellaneous Material Receipt Details",
        labelKey: "STORE_MATERIAL_RECEIPT_MATERIAL_MISC_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    materialReceiptCard
  });