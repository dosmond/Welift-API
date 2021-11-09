create function generate_random_referral()
   returns text
   language plpgsql
  as
$$
BEGIN
	RETURN LOWER(SUBSTRING(MD5(uuid_generate_v4()::TEXT) FOR 8));
END;
$$;

create function generate_random_referral_2()
   returns text
   language plpgsql
  as
$$
BEGIN
	RETURN LOWER(SUBSTRING(MD5(uuid_generate_v4()::TEXT) FOR 10));
END;
$$;