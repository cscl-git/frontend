import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getDateField,
    getSelectField,
    getCommonContainer,
    getCommonGrayCard,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
 import { getTodaysDateInYMD } from "../../utils";
  
  export const OpeningBalanceDetails = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Material Opening Balance Details",
        labelKey: "STORE_MATERIAL_OPENNING_BALANCE_HEADER"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    

    View1: getCommonGrayCard({
      header1: getCommonTitle(
        {
          labelName: "Financial Year",
          labelKey: "STORE_MATERIAL_OPENNING_BALANCE_FINANCIAL_YEAR"
        },
        {
          style: {
            marginBottom: 18
          }
        }
      ),
      FinancialYearContainer: getCommonContainer({

  
        financialYear: {
          ...getSelectField({
            label: { labelName: "Financial Year", labelKey: "STORE_MATERIAL_OPENNING_BALANCE_FINANCIAL_YEAR" },
            placeholder: {
              labelName: "Select Financial Year",
              labelKey: "STORE_MATERIAL_OPENNING_BALANCE_FINANCIAL_YEAR_SELECT"
            },
            required: true,
            jsonPath: "materialReceipt[0].financialYear",
            sourceJsonPath: "searchScreenMdmsData.egf-master.FinancialYear",
            props: {
             
              optionValue: "code",
              optionLabel: "name"
            },
          })
        },
       
        receivingStorecode: {
          ...getSelectField({
            label: {
              labelName: "Store Name",
              labelKey: "STORE_DETAILS_STORE_NAME"
            },
            placeholder: {
              labelName: "Select Store Name",
              labelKey: "STORE_DETAILS_STORE_NAME_SELECT"
            },
            required: true,
            jsonPath: "materialReceipt[0].receivingStore.code",
            gridDefination: {
              xs: 12,
              sm: 4,
            },
            sourceJsonPath: "store.stores",
            props: {
              optionValue: "code",
              optionLabel: "name",
            },
          })
        },
        
       
        
      }),
    }),
    View2: getCommonGrayCard({
      header2: getCommonTitle(
        {
          labelName: "Material Opening Balance",
          labelKey: "STORE_MATERIAL_OPENNING_BALANCE"
        },
        {
          style: {
            marginBottom: 18
          }
        }
      ),
      OpeningBalanceContainer: getCommonContainer({
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
            required: false,
           
            jsonPath: "materialReceipt[0].receiptDetails[0].material.code",
            sourceJsonPath: "material.materials",
            props: {
              optionValue: "code",
              optionLabel: "description",
            },
          })
        },
        MaterialoldCode: {
          ...getTextField({
            label: {
              labelName: "Material Old Code",
              labelKey: "STORE_MATERIAL_OLD_CODE"
            },
            placeholder: {
              labelName: "Material Old Code",
              labelKey: "STORE_MATERIAL_OLD_CODE"
            },
            required: false,
            visible:false,
            props:{
              disabled:true,
            },
            pattern: getPattern("Name") || null,
            jsonPath: "materialReceipt[0].receiptDetails[0].material.code"
          })
        },
        LotNumber: {
          ...getTextField({
            label: {
              labelName: "Lot No.",
              labelKey: "STORE_MATERIAL_OPENNING_BALANCE_LOT_NO"
            },
            placeholder: {
              labelName: "Lot No.",
              labelKey: "STORE_MATERIAL_OPENNING_BALANCE_LOT_NO"
            },
            required: true,
            pattern: getPattern("Name") || null,
            jsonPath: "materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].lotNo"
          })
        }, 
        ExpiryDate: {
          ...getDateField({
            label: {
              labelName: "Expiry Date",
              labelKey: "STORE_MATERIAL_OPENNING_BALANCE_EXPIRY_DATE"
            },
            placeholder: {
              labelName: "Expiry Date",
              labelKey: "STORE_MATERIAL_OPENNING_BALANCE_EXPIRY_DATE"
            },
            required: true,
            pattern: getPattern("Date") || null,
            jsonPath: "materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].expiryDate",
            props: {
              inputProps: {
                max: getTodaysDateInYMD()
              }
            }
          })
        }, 
        OpeningQty: {
          ...getTextField({
            label: {
              labelName: "Opening Qty",
              labelKey: "STORE_MATERIAL_OPENNING_BALANCE_OPENING_QTY"
            },
            placeholder: {
              labelName: "Opening Qty",
              labelKey: "STORE_MATERIAL_OPENNING_BALANCE_OPENING_QTY"
            },
            required: true,
            pattern: getPattern("Amount") || null,
            jsonPath: "materialReceipt[0].receiptDetails[0].userReceivedQty"
          })
        },
        OpeningRate: {
          ...getTextField({
            label: {
              labelName: "Opening Rate",
              labelKey: "STORE_MATERIAL_OPENNING_BALANCE_OPENING_RATE"
            },
            placeholder: {
              labelName: "Opening Rate",
              labelKey: "STORE_MATERIAL_OPENNING_BALANCE_OPENING_RATE"
            },
            required: true,
            pattern: getPattern("Amount") || null,
            jsonPath: "materialReceipt[0].receiptDetails[0].unitRate"
          })
        },

        receiptNumber: {
          ...getTextField({
            label: {
              labelName: "Receipt No.",
              labelKey: "STORE_MATERIAL_OPENNING_BALANCE_RECEIPT_NO"
            },
            placeholder: {
              labelName: "Receipt No.",
              labelKey: "STORE_MATERIAL_OPENNING_BALANCE_RECEIPT_NO"
            },
            required: false,
            pattern: getPattern("Name") || null,
            jsonPath: "materialReceipt[0].receiptNumber"
          })
        }, 
        receiptDate: {
        ...getDateField({
          label: {
            labelName: "Receipt Date",
            labelKey: "STORE_MATERIAL_OPENNING_BALANCE_RECEIPT_DATE"
          },
          placeholder: {
            labelName: "Receipt Date",
            labelKey: "STORE_MATERIAL_OPENNING_BALANCE_RECEIPT_DATE"
          },
          required: true,
          pattern: getPattern("Date") || null,
          jsonPath: "materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].receivedDate",
          props: {
            inputProps: {
              max: getTodaysDateInYMD()
            }
          }
        })
      },
      remarks: {
        ...getTextField({
          label: {
            labelName: "Remarks",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK"
          },
          placeholder: {
            labelName: "Remarks",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK_PLACEHOLDER"
          },
          required: true,
          props: {
            className: "applicant-details-error",
            multiline: "multiline",
            rowsMax: 2,
          },
          pattern: getPattern("eventDescription") || null,
          jsonPath: "materialReceipt[0].receiptDetails[0].remarks"
        })
      }, 
       
      })
    }),
  });