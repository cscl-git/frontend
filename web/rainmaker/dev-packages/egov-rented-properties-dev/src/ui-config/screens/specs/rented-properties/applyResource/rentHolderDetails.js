import { getCommonCard, getSelectField, getTextField, getDateField, getCommonTitle, getPattern, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTodaysDateInYMD } from "../../utils";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

let userInfo = JSON.parse(getUserInfo());

const rentHolderHeader = getCommonTitle(
    {
        abelName: "Rent holder Particulars",
        labelKey: "RP_RENT_HOLDER_PARTICULAR_HEADER"
    },
    {
        style: {
                marginBottom: 18,
                marginTop: 18
        }
    }
  )

export const getGenderLabel = {
    uiFramework: "custom-containers",
    componentPath: "RadioGroupContainer",
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 6
    },
    jsonPath: "Properties[0].owners[0].ownerDetails.gender",
    props: {
      label: {
        name: "Gender",
        key: "TL_COMMON_GENDER_LABEL"
      },
      buttons: [
        {
            labelName: "Male",
            labelKey: "COMMON_MALE",
            value: "MALE"
        },
        {
            label: "Female",
            labelKey: "COMMON_FEMALE",
            value: "FEMALE"
        }
      ],
      jsonPath:"Properties[0].owners[0].ownerDetails.gender",
      required: true
    },
    required: true,
    type: "array"
  };


export const getRelationshipRadioButton = {
    uiFramework: "custom-containers",
    componentPath: "RadioGroupContainer",
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 6
    },
    jsonPath: "Properties[0].owners[0].ownerDetails.relation",
    props: {
      label: {
        name: "Relationship",
        key: "TL_COMMON_RELATIONSHIP_LABEL"
      },
      buttons: [
        {
          labelName: "Father",
          labelKey: "COMMON_RELATION_FATHER",
          value: "FATHER"
        },
        {
          label: "Husband",
          labelKey: "COMMON_RELATION_HUSBAND",
          value: "HUSBAND"
        }
      ],
      jsonPath:"Properties[0].owners[0].ownerDetails.relation",
      required: true
    },
    required: true,
    type: "array"
  };

  const ownerShipRelationShip = {
      ...getRelationshipRadioButton,
      jsonPath: "Owners[0].ownerDetails.relationWithDeceasedAllottee",
      props: {
          ...getRelationshipRadioButton.props,
          buttons: [
            {
              labelName: "Legal Heir",
              labelKey: "COMMON_RELATION_LEGAL_HEIR",
              value: "LEGAL_HEIR"
            },
            {
              label: "Spouse",
              labelKey: "COMMON_RELATION_SPOUSE",
              value: "SPOUSE"
            }
          ],
          jsonPath: "Owners[0].ownerDetails.relationWithDeceasedAllottee"
      }
  }

const fatherOrHusbandsNameField = {
    label: {
        labelName: "Father/ Husband's Name",
        labelKey: "TL_FATHER_OR_HUSBANDS_NAME_LABEL"
    },
    placeholder: {
        labelName: "Enter Father/ Husband's Name",
        labelKey: "TL_FATHER_OR_HUSBANDS_NAME_NAME_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 4,
    maxLength: 40,
    required: true,
    jsonPath: "Properties[0].owners[0].ownerDetails.fatherOrHusband"
}

const ownerNameField = {
    label: {
        labelName: "Owner Name",
        labelKey: "RP_OWNER_NAME_LABEL"
    },
    placeholder: {
        labelName: "Enter Owner Name",
        labelKey: "RP_OWNER_NAME_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 4,
    maxLength: 40,
    required: true,
    jsonPath: "Properties[0].owners[0].ownerDetails.name"
  }

const phoneNumberConfig = {
    label: {
        labelName: "Mobile No.",
        labelKey: "RP_MOBILE_NO_LABEL"
    },
    placeholder: {
        labelName: "Enter Mobile No.",
        labelKey: "RP_MOBILE_NO_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 1,
    maxLength: 100,
    required: true,
    pattern: getPattern("MobileNo"),
  }

  const phoneNumberField = {
      ...phoneNumberConfig,
      jsonPath: "Properties[0].owners[0].ownerDetails.phone",
}

const dobFieldConfig = {
    label: {
        labelName: "Date of Birth",
        labelKey: "RP_DATE_BIRTH_LABEL"
    },
    placeholder: {
        labelName: "Enter Date of Birth",
        labelKey: "RP_DATE_BIRTH_PLACEHOLDER"
    },
    required: true,
    pattern: getPattern("Date"),
    jsonPath: "Properties[0].owners[0].ownerDetails.dateOfBirth",
    props: {
        inputProps: {
            max: getTodaysDateInYMD()
        }
    }
}  

const dobField = {
    ...dobFieldConfig,
    jsonPath: "Properties[0].owners[0].ownerDetails.dateOfBirth",
}

const deathField = {
    ...dobFieldConfig,
    label: {
        labelName: "Date of Death of Allotee",
        labelKey: "RP_DATE_DEATH_LABEL_ALLOTEE"
    },
    placeholder: {
        labelName: "Enter Date of Death",
        labelKey: "RP_DATE_DEATH_PLACEHOLDER"
    },
    jsonPath: "Owners[0].ownerDetails.dateOfDeathAllottee"
}

const emailConfig = {
    label: {
        labelName: "Email",
      labelKey: "RP_OWNER_DETAILS_EMAIL_LABEL"
    },
    placeholder: {
        labelName: "Enter Email",
        labelKey: "RP_OWNER_DETAILS_EMAIL_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    // minLength: 1,
    // maxLength: 100,
    // required: false,
    pattern: getPattern("Email"),
  }

const emailField = {
    ...emailConfig,
    jsonPath: "Properties[0].owners[0].ownerDetails.email",
    required: false
}

const aadharFieldConfig = {
    label: {
        labelName: "Aadhar Number",
        labelKey: "RP_AADHAR_LABEL"
    },
    placeholder: {
        labelName: "Enter Aadhar Number",
        labelKey: "RP_AADHAR_NUMBER_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    // minLength: 1,
    // maxLength: 100,
    // required: true,
}

const aadharField = {
    ...aadharFieldConfig,
    jsonPath: "Properties[0].owners[0].ownerDetails.aadhaarNumber"
}

const colonyField = {
    label: {
        labelName: "Colony",
        labelKey: "RP_COLONY_LABEL"
    },
    placeholder: {
        labelName: "Enter Colony",
        labelKey: "RP_COLONY_PLACEHOLDER"
    },
    required: true,
    jsonPath: "Properties[0].owners[0].ownerDetails.correspondenceAddress.colony",
    optionValue: "code",
    optionLabel: "label",
    sourceJsonPath: "applyScreenMdmsData.propertyTypes",
    gridDefination: {
        xs: 12,
        sm: 6
    }
}

const getRentHolderDetails = () => {
    return {
        header: rentHolderHeader,
        detailsContainer: getCommonContainer({
            ownerName: getTextField(ownerNameField),
            phone: getTextField(phoneNumberField),
            fatherOrHusbandsName:getTextField(fatherOrHusbandsNameField),
            relationShip: getRelationshipRadioButton,
            email: getTextField(emailField),
            aadhar: getTextField(aadharField)
        })
    }
}

const applicantNameField = {
    label: {
        labelName: "Applicant Name",
        labelKey: "RP_APPLICANT_NAME_LABEL"
    },
    placeholder: {
        labelName: "Enter Applicant Name",
        labelKey: "RP_APPLICANT_NAME_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 1,
    maxLength: 100,
    required: true,
    jsonPath: "Owners[0].ownerDetails.name"
}

const applicantNameFieldname = {
    label: {
        labelName: "Applicant Name",
        labelKey: "RP_APPLICANT_NAME_LABEL"
    },
    placeholder: {
        labelName: "Enter Applicant Name",
        labelKey: "RP_APPLICANT_NAME_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 1,
    maxLength: 100,
    required: true,
    jsonPath: "Duplicate[0].applicant[0].name"
}


const applicantphoneNumberField = {
    ...phoneNumberConfig,
    props: {
        value: userInfo.userName,
        disabled: true
      },
    jsonPath: "Properties[0].owners[0].ownerDetails.phone"
}

const applicantphoneNumberFieldduplicate = {
    ...phoneNumberConfig,
    props: {
        value: userInfo.userName,
        disabled: true
      },
    jsonPath: "Duplicate[0].applicant[0].phone"
}

export const  applicantGenderLabel = {
    uiFramework: "custom-containers",
    componentPath: "RadioGroupContainer",
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 6
    },
    jsonPath: "OwnerShipLicenses[0].owners[0].gender",
    props: {
      label: {
        name: "Gender",
        key: "TL_COMMON_GENDER_LABEL"
      },
      buttons: [
        {
            labelName: "Male",
            labelKey: "COMMON_MALE",
            value: "MALE"
        },
        {
            label: "Female",
            labelKey: "COMMON_FEMALE",
            value: "FEMALE"
        }
      ],
      jsonPath:"OwnerShipLicenses[0].owners[0].gender",
      required: true
    },
    required: true,
    type: "array"
};


const fatherOrHusbandsName = {
    label: {
        labelName: "Father/ Husband's Name",
        labelKey: "TL_FATHER_OR_HUSBANDS_NAME_LABEL"
    },
    placeholder: {
        labelName: "Enter Father/ Husband's Name",
        labelKey: "TL_FATHER_OR_HUSBANDS_NAME_NAME_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 4,
    maxLength: 40,
    required: true,
    jsonPath: "Duplicate[0].applicant[0].guardian"
}

const ownerShipRelationShipduplicate = {
      ...getRelationshipRadioButton,
      jsonPath: "Duplicate[0].applicant[0].relationship",
      props: {
          ...getRelationshipRadioButton.props,
          buttons: [
            {
              labelName: "Legal Heir",
              labelKey: "COMMON_RELATION_LEGAL_HEIR",
              value: "LEGAL_HEIR"
            },
            {
              label: "Spouse",
              labelKey: "COMMON_RELATION_SPOUSE",
              value: "SPOUSE"
            }
          ],
          jsonPath: "Duplicate[0].applicant[0].relationship"
      }
  }

const applicantEmailField = {
    ...emailConfig,
    jsonPath: "Owners[0].ownerDetails.email",
    required: false
}

const applicantEmailFieldduplicate = {
    ...emailConfig,
    jsonPath: "Duplicate[0].applicant[0].email",
    required: false
}


const applicantAadharField = {
    ...aadharFieldConfig,
     jsonPath: "Owners[0].ownerDetails.aadhaarNumber"
}

const applicantAadharFieldduplicate = {
    ...aadharFieldConfig,
     jsonPath: "Duplicate[0].applicant[0].adhaarNumber"
}

const applicantAddressField = {
    label: {
        labelName: "Applicant Correspondence Address",
        labelKey: "RP_APPLICANT_CORRESPONDENCE_ADDRESS_LABEL"
    },
    placeholder: {
        labelName: "Enter Applicant Correspondence Address",
        labelKey: "RP_APPLICANT_CORRESPONDENCE_ADDRESS_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 1,
    maxLength: 100,
    required: true,
    jsonPath: "OwnerShipLicenses[0].owners[0].correspondenceAddress"
}

const getApplicantDetails = () => {
    return {
        header: rentHolderHeader,
        detailsContainer: getCommonContainer({
            ownerName: getTextField(applicantNameField),
            relationShip: ownerShipRelationShip,
            phone: getTextField(applicantphoneNumberField),
            deathOfAllotee: getDateField(deathField),
            email: getTextField(applicantEmailField),
            aadhar: getTextField(applicantAadharField),
        })
    }
}

const getApplicantDetailsForDuplicateCopy = () => {
    return {
        header: rentHolderHeader,
        detailsContainer: getCommonContainer({
            ownerName: getTextField(applicantNameFieldname),
            fatherOrHusband:getTextField(fatherOrHusbandsName),
            relationShip: ownerShipRelationShipduplicate,
            phone: getTextField(applicantphoneNumberFieldduplicate),
            email: getTextField(applicantEmailFieldduplicate),
            aadhar: getTextField(applicantAadharFieldduplicate),
        })
    }
}

export const applicantDetails = getCommonCard(getApplicantDetails())


export const rentHolderDetails = getCommonCard(getRentHolderDetails())

export const rentHolderDetailsForDuplicateProperties = getCommonCard(getApplicantDetailsForDuplicateCopy())