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
  import { getTodaysDateInYMD } from "../../utils";
  import get from "lodash/get";
  import { handleScreenConfigurationFieldChange as handleField , prepareFinalObject} from "egov-ui-framework/ui-redux/screen-configuration/actions";
  
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
  
  const MaterialIndentDetailsCard = {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      scheama: getCommonGrayCard({
        storeDetailsCardContainer: getCommonContainer(
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
                jsonPath: "indents[0].indentDetails[0].material.code",
                sourceJsonPath: "materials.materials",
                props: {
                  optionValue: "code",
                  optionLabel: "name",
                },
              }),
              beforeFieldChange: (action, state, dispatch) => {
                let Material = get(state, "screenConfiguration.preparedFinalObject.createScreenMdmsData.store-asset.Material",[]) 
                let MaterialType = Material.filter(x=>x.code == action.value)//.materialType.code
               
                if(MaterialType[0])
                {
                  dispatch(prepareFinalObject("indents[0].indentDetails[0].material.name",MaterialType[0].name));
                dispatch(prepareFinalObject("indents[0].indentDetails[0].uom.code",MaterialType[0].baseUom.code));
                dispatch(prepareFinalObject("indents[0].indentDetails[0].uom.name",MaterialType[0].baseUom.name));
              }
              }
            },
            MaterialDescription: {
              ...getTextField({
                label: {
                  labelName: "Material Description",
                  labelKey: "STORE_MATERIAL_DESCRIPTION"
                },
                placeholder: {
                  labelName: "Material Description",
                  labelKey: "STORE_MATERIAL_DESCRIPTION"
                },
                props:{
                  disabled:true
                },
                required: false,
                pattern: getPattern("Name") || null,
                jsonPath: "indents[0].storeMapping[0].MaterialDescription"
              })
            },
            UOMName: {
              ...getSelectField({
                label: {
                  labelName: "UOM Name",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_UOM_NAME"
                },
                placeholder: {
                  labelName: "Select UOM Name",
                  labelKey: "STORE_MATERIAL_INDENT_UOM_NAME_SELECT"
                },
               
                required: false,
                pattern: getPattern("Name") || null,
                jsonPath: "indents[0].indentDetails[0].uom.code",
                sourceJsonPath: "createScreenMdmsData.common-masters.UOM",
                props: {
                  disabled:true,
                  optionLabel: "name",
                  optionValue: "code"
                },
              })
            },
            AssestCode: {
              ...getTextField({
                label: {
                  labelName: "Assest Code",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_ASSEST_CODE"
                },
                placeholder: {
                  labelName: "Assest Code",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_ASSEST_CODE"
                },
                props:{
                  disabled:true
                },
                required: false,
                pattern: getPattern("Name") || null,
                jsonPath: "indents[0].indentDetails[0].asset.code",
               // sourceJsonPath: "createScreenMdmsData.common-masters.UOM",
                props: {
                  data: [
                    {
                      value: "Code1",
                      label: "Code1"
                    },
                    
                  ],
                  optionValue: "value",
                  optionLabel: "label"
                },
              })
            },
            ProjectCode: {
              ...getTextField({
                label: {
                  labelName: "Project Code",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_PROJECT_CODE"
                },
                placeholder: {
                  labelName: "Project Code",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_PROJECT_CODE"
                },
                props:{
                  disabled:true
                },
                required: false,
                visible:false,
                pattern: getPattern("Name") || null,
                jsonPath: "indents[0].indentDetails[0].project.code",
                //sourceJsonPath: "createScreenMdmsData.common-masters.UOM",
                props: {
                  data: [
                    {
                      value: "PR1",
                      label: "PR1"
                    },
                    
                  ],
                  optionValue: "value",
                  optionLabel: "label"
                },
              })
            },
            indentQuantity: {
              ...getTextField({
                label: {
                  labelName: "indentQuantity",
                  labelKey: "STORE_MATERIAL_INDENT_QUANTITY"
                },
                placeholder: {
                  labelName: " indent Quantity",
                  labelKey: "STORE_MATERIAL_INDENT_QUANTITY_PLACEHOLDER"
                },
                props:{
                  disabled:false
                },
                required: true,
                pattern: getPattern("Amount") || null,
                jsonPath: "indents[0].indentDetails[0].indentQuantity"
              })
            },
            QuantityRequired: {
              ...getTextField({
                label: {
                  labelName: "QuantityRequired",
                  labelKey: "STORE_MATERIAL_INDENT_QUANTITY_REQUIRED"
                },
                placeholder: {
                  labelName: "QuantityRequired",
                  labelKey: "STORE_MATERIAL_INDENT_QUANTITY_REQUIRED_PLACEHOLDER"
                },
                props:{
                  disabled:false
                },
                required: true,
                pattern: getPattern("Amount") || null,
                jsonPath: "indents[0].indentDetails[0].userQuantity"
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
        labelName: "ADD",
        labelKey: "STORE_MATERIAL_COMMON_CARD_ADD"
      },
      headerName: "Store",
      headerJsonPath:
        "children.cardContent.children.header.children.head.children.Accessories.props.label",
      sourceJsonPath: "indents[0].indentDetails",
      prefixSourceJsonPath:
        "children.cardContent.children.storeDetailsCardContainer.children"
    },
    type: "array"
  };
  
  export const MaterialIndentMapDetails = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Material Indent Details",
        labelKey: "STORE_MATERIAL_INDENT_MATERIAL_INDENT_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    MaterialIndentDetailsCard
  });