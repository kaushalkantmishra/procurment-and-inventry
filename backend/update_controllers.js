// Script to update all controllers to constructor pattern
const controllers = [
  'poLine.controller.ts',
  'grnHeader.controller.ts', 
  'grnDetail.controller.ts',
  'purchaseRequest.controller.ts'
];

// This will be applied to each controller file
const pattern = `
export class {ClassName} {
  private {serviceName}: {ServiceClass};

  constructor() {
    this.{serviceName} = new {ServiceClass}();
  }

  // Convert all static methods to instance methods
  // Replace ErrorHandler.handleError with ApiResponse methods
  // Use this.{serviceName} instead of {ServiceClass}
`;