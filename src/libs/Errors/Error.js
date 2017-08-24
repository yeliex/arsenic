/**
 *
 * @class CommonError
 * @author: yeliex
 * @create: 2017/8/23 下午3:46
 */
const ErrorCode = require('./ErrorCode');
const ErrorCodes = require('./ErrorCodes');
const BaseError = require('./BaseError');
const SeriesTypes = require('./SeriesTypes');
const SeriesType = require('./SeriesType');
const DomainTypes = require('./DomainTypes');
const LevelTypes = require('./LevelTypes');
const SourceTypes = require('./SourceTypes');
const PriorityTypes = require('./PriorityTypes');
const assert = require('assert');

exports.SystemError = class SystemError extends BaseError {
  constructor(props) {
    super(props);
    this.code = ErrorCodes.SYSTEM_ERROR_CODE;
    this.seriesType = SeriesTypes.COMMON;
    this.domainType = DomainTypes.S;
    this.levelType = LevelTypes.ERROR;
    this.source = SourceTypes.INNER;
    this.priority = PriorityTypes.P0;
  }
};

exports.BizError = class BizError extends BaseError {
  constructor(props) {
    super(props);
    this.domainType = DomainTypes.B;
    this.levelType = LevelTypes.ERROR;
    this.source = SourceTypes.INNER;
    this.priority = PriorityTypes.P2;
  }
};

exports.IllegalParamError = class IllegalParamError extends BaseError {
  constructor(props) {
    super(props);
    this.domainType = DomainTypes.B;
    this.levelType = LevelTypes.ERROR;
    this.priority = PriorityTypes.P2;
    this.code = ErrorCodes.ILLEGAL_PARAM_CODE;
    this.seriesType = SeriesTypes.COMMON;
  }
};

exports.MissAccessUserError = class MissAccessUserError extends BaseError {
  constructor(props) {
    super(props);
    this.domainType = DomainTypes.B;
    this.levelType = LevelTypes.ERROR;
    this.priority = PriorityTypes.P1;
    this.code = ErrorCodes.USER_NOT_EXIST_CODE;
    this.seriesType = SeriesTypes.COMMON;
  }
};

exports.PagedNoMoreData = class PagedNoMoreData extends BaseError {
  constructor(props) {
    super(props);

    this.domainType = DomainTypes.B;
    this.levelType = LevelTypes.ERROR;
    this.source = SourceTypes.INNER;
    this.priority = PriorityTypes.P1;
    this.code = ErrorCodes.PAGED_NO_MORE_DATA_CODE;
    this.seriesType = SeriesTypes.COMMON;
  }
};

exports.PermissionError = class PermissionError extends BaseError {
  constructor(props) {
    super(props);
    this.domainType = DomainTypes.B;
    this.levelType = LevelTypes.ERROR;
    this.source = SourceTypes.INNER;
    this.priority = PriorityTypes.P1;
    this.code = ErrorCodes.PERMISSION_ERROR_CODE;
    this.seriesType = SeriesTypes.COMMON;
  }
};

exports.EntityNotExist = class EntityNotExist extends BaseError {
  constructor(props) {
    super(props);

    this.domainType = DomainTypes.B;
    this.levelType = LevelTypes.ERROR;
    this.source = SourceTypes.INNER;
    this.priority = PriorityTypes.P1;
    this.code = ErrorCodes.ENTITY_NOT_EXIST_CODE;
    this.seriesType = SeriesTypes.COMMON;
  }
};

exports.UnknownError = class UnknownError extends BaseError {
  constructor(props) {
    super(props);

    this.domainType = DomainTypes.B;
    this.levelType = LevelTypes.ERROR;
    this.source = SourceTypes.INNER;
    this.priority = PriorityTypes.P1;
    this.code = ErrorCodes.UNKNOWN_CODE;
    this.seriesType = SeriesTypes.COMMON;
  }
};

exports.ErrorTemplate = function ErrorTemplate(seriesType) {
  assert(seriesType instanceof SeriesType, 'seriesType must be SeriesType');

  return class CustomError extends BizError {
    constructor(code, message) {
      super();
      this.code = new ErrorCode(code, message);
      this.seriesType = seriesType;
    }
  };
};

exports.Error = BaseError;

exports.DomainType = require('./DomainType');
exports.DomainTypes = DomainTypes;

exports.ErrorCode = ErrorCode;
exports.ErrorCodes = ErrorCodes;

exports.Exception = require('./Exception');

exports.LevelType = require('./LevelType');
exports.LevelTypes = LevelTypes;

exports.PriorityType = require('./PriorityType');
exports.PriorityTypes = PriorityTypes;

exports.SeriesType = SeriesType;
exports.SeriesTypes = SeriesTypes;

exports.SourceType = require('./SourceType');
exports.SourceTypes = SourceTypes;
