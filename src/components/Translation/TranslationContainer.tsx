import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { TRANSLATIONS } from '../../constants/translations';
import { RootState } from '../../reducer';
import { errorFromServer } from '../../thunkActions/errorHandling';
import { ErrorLoadedAction, LogOutAction } from '../../reducer/auth';
import { LoginOrSignupErrorAction } from '../../reducer/error';
import Translation from './Translation';

interface StateProps {
  locale: string;
}

interface OwnProps {
  translationKey: string;
  args?: string[];
}
interface DispatchProps {
  dispatch: ThunkDispatch<
    RootState,
    unknown,
    LogOutAction | ErrorLoadedAction | LoginOrSignupErrorAction
  >;
}

type Props = StateProps & OwnProps & DispatchProps;

interface State {
  translation: string;
}

class TranslationContainer extends Component<Props, State> {
  readonly state: State = { translation: '' };

  componentDidMount() {
    this._updateTranslation(
      this.props.translationKey,
      this.props.locale,
      this.props.args
    );
  }

  componentDidUpdate(prevProps: Props) {
    // update the translation if one of the props has changed
    if (
      this.props.translationKey !== prevProps.translationKey ||
      this.props.locale !== prevProps.locale ||
      this.props.args !== prevProps.args
    ) {
      this._updateTranslation(
        this.props.translationKey,
        this.props.locale,
        this.props.args
      );
    }
  }

  _updateTranslation(
    translationKey: string,
    activeLanguageCode: string,
    args?: string[]
  ) {
    if (translationKey && activeLanguageCode) {
      try {
        let translation = TRANSLATIONS[activeLanguageCode][translationKey];
        if (args && args.length > 0) {
          args.forEach((arg) => (translation = translation.replace('{}', arg)));
        }
        this.setState({
          translation,
        });
      } catch (error) {
        this.props.dispatch(errorFromServer(error, '_updateTranslation'));
      }
    }
  }

  render() {
    if (!this.state.translation || this.state.translation === '') return null;
    return <Translation translation={this.state.translation} />;
  }
}

function mapStateToProps(state: RootState): StateProps {
  return {
    locale: state.translation.locale,
  };
}

export default connect<StateProps, void, OwnProps, RootState>(mapStateToProps)(
  TranslationContainer
);
