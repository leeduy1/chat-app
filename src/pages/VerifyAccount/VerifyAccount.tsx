import { HeartFilled } from '@ant-design/icons';
import Button from '@common/Button/Button';
import Logo from '@common/Logo/Logo';
import Title from '@common/Title/Title';
import Language from '@modules/Language/Language';
import { notification } from 'antd';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import { logoutSuccess } from 'src/store/authSlice';
import { useAppDispatch } from 'src/store/hooks';
import { checkOtp, getOtp, logout } from 'src/services/authService';

import './VerifyAccount.scss';

const VerifyAccount: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['common', 'verify-account']);

  const [isGettingOtp, setIsGettingOtp] = React.useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = React.useState(false);
  const [otp, setOtp] = React.useState('');

  const handleGetOtp = async () => {
    setIsGettingOtp(true);
    try {
      await getOtp(t);
      setIsGettingOtp(false);
    } catch (err) {
      setIsGettingOtp(false);
    }
  };

  const handleCheckOtp = async (otp: string) => {
    if (otp.length !== 6) {
      notification.warning({
        message: t('warning'),
        description: t('has-six-character', { ns: 'verify-account' }),
        duration: 1.5,
        key: '1',
      });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const isSuccess: boolean = await checkOtp(otp, t);
      console.log(otp);
      console.log(isSuccess);

      if (isSuccess) {
        notification.success({
          message: t('success'),
          description: t('check-otp-success', { ns: 'verify-account' }),
          duration: 1.5,
          key: '1',
        });

        navigate('/dashboard');
        setIsVerifyingOtp(false);
      } else {
        setIsVerifyingOtp(false);
        notification.error({
          message: t('error'),
          description: t('check-otp-error', { ns: 'verify-account' }),
          duration: 1.5,
          key: '1',
        });
      }
    } catch (err) {
      setIsVerifyingOtp(false);
    }
  };

  const handleLogout = async () => {
    await logout(t);
    dispatch(logoutSuccess());

    navigate('/login');
  };

  return (
    <div className="otp-page">
      <Logo />
      <div className="otp-check">
        <Title className="otp-check__heading" level={4}>
          {t('title', { ns: 'verify-account' })}
        </Title>
        <Title className="otp-check__sub-heading" level={5}>
          {t('sub-title', { ns: 'verify-account' })}
        </Title>
        <OtpInput
          value={otp}
          onChange={(otp: string) => setOtp(otp)}
          numInputs={6}
          isInputNum
          separator={<span>-</span>}
          containerStyle={{
            justifyContent: 'center',
          }}
          inputStyle={{
            width: '40px',
            height: '40px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            textAlign: 'center',
            fontSize: ' 18px',
            fontWeight: ' bold',
            lineHeight: '1',
            outline: 'none',
          }}
        />
        <Title className="otp-check__desc" level={4}>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          {t('description', { ns: 'verify-account' })}
          <Button
            className="btn-resend"
            loading={isGettingOtp}
            onClick={handleGetOtp}
          >
            {t('btn-resend', { ns: 'verify-account' })}
          </Button>
        </Title>
        <div className="otp-check__btn">
          <Button className="btn-reset" onClick={() => setOtp('')}>
            {t('btn-reset', { ns: 'verify-account' })}
          </Button>
          <Button
            className="btn-verify"
            loading={isVerifyingOtp}
            onClick={() => handleCheckOtp(otp)}
          >
            {t('btn-verify', { ns: 'verify-account' })}
          </Button>
        </div>
      </div>

      <div className="otp-page__footer">
        <Language />
        <Title className="anothor-account-title" level={4}>
          {t('ask-account', { ns: 'verify-account' })}
          <Button className="btn-back-login" onClick={handleLogout}>
            {t('btn-sign-in', { ns: 'verify-account' })}
          </Button>
        </Title>
        <Title className="author" level={5}>
          {t('author-title', { ns: 'verify-account' })}
          <HeartFilled className="author__heart-icon" />{' '}
          {t('author', { ns: 'verify-account' })}
        </Title>
      </div>
    </div>
  );
};

export default VerifyAccount;
