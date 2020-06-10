export interface User {
    firstName: string,
    middleName: string,
    lastName: string,
    phoneNumber: string,
    email: string
  }

  export interface RefData {
      key: string,
      value: string,
      type: string,
      shortDescription: string,
      longDescription: string
  }

  export interface DataProduct {
    key: string,
    type: RefData,
    createdDate: string,
    updatedDate: string,
    user: User
  }

  export interface History {
    id?: string,
    entity: EntityId,
    createdDate: string,
    data: string
  }

  export interface EntityId {
    entityName: string,
    entityId: string
  }

  export interface DataProduct {
    id?: string,
    createdBy: User,
    createdOn: string,
    updatedBy: User,
    updatedOn: string,
    title: string,
    description: string,
    poc: User,
    type: RefData,
    eventType: RefData

  }