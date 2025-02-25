--
-- PostgreSQL database dump
--

-- Dumped from database version 17.3 (Debian 17.3-3.pgdg120+1)
-- Dumped by pg_dump version 17.3 (Debian 17.3-3.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_event_entity; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.admin_event_entity (
    id character varying(36) NOT NULL,
    admin_event_time bigint,
    realm_id character varying(255),
    operation_type character varying(255),
    auth_realm_id character varying(255),
    auth_client_id character varying(255),
    auth_user_id character varying(255),
    ip_address character varying(255),
    resource_path character varying(2550),
    representation text,
    error character varying(255),
    resource_type character varying(64)
);


ALTER TABLE public.admin_event_entity OWNER TO keycloak;

--
-- Name: associated_policy; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.associated_policy (
    policy_id character varying(36) NOT NULL,
    associated_policy_id character varying(36) NOT NULL
);


ALTER TABLE public.associated_policy OWNER TO keycloak;

--
-- Name: authentication_execution; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.authentication_execution (
    id character varying(36) NOT NULL,
    alias character varying(255),
    authenticator character varying(36),
    realm_id character varying(36),
    flow_id character varying(36),
    requirement integer,
    priority integer,
    authenticator_flow boolean DEFAULT false NOT NULL,
    auth_flow_id character varying(36),
    auth_config character varying(36)
);


ALTER TABLE public.authentication_execution OWNER TO keycloak;

--
-- Name: authentication_flow; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.authentication_flow (
    id character varying(36) NOT NULL,
    alias character varying(255),
    description character varying(255),
    realm_id character varying(36),
    provider_id character varying(36) DEFAULT 'basic-flow'::character varying NOT NULL,
    top_level boolean DEFAULT false NOT NULL,
    built_in boolean DEFAULT false NOT NULL
);


ALTER TABLE public.authentication_flow OWNER TO keycloak;

--
-- Name: authenticator_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.authenticator_config (
    id character varying(36) NOT NULL,
    alias character varying(255),
    realm_id character varying(36)
);


ALTER TABLE public.authenticator_config OWNER TO keycloak;

--
-- Name: authenticator_config_entry; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.authenticator_config_entry (
    authenticator_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.authenticator_config_entry OWNER TO keycloak;

--
-- Name: broker_link; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.broker_link (
    identity_provider character varying(255) NOT NULL,
    storage_provider_id character varying(255),
    realm_id character varying(36) NOT NULL,
    broker_user_id character varying(255),
    broker_username character varying(255),
    token text,
    user_id character varying(255) NOT NULL
);


ALTER TABLE public.broker_link OWNER TO keycloak;

--
-- Name: client; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client (
    id character varying(36) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    full_scope_allowed boolean DEFAULT false NOT NULL,
    client_id character varying(255),
    not_before integer,
    public_client boolean DEFAULT false NOT NULL,
    secret character varying(255),
    base_url character varying(255),
    bearer_only boolean DEFAULT false NOT NULL,
    management_url character varying(255),
    surrogate_auth_required boolean DEFAULT false NOT NULL,
    realm_id character varying(36),
    protocol character varying(255),
    node_rereg_timeout integer DEFAULT 0,
    frontchannel_logout boolean DEFAULT false NOT NULL,
    consent_required boolean DEFAULT false NOT NULL,
    name character varying(255),
    service_accounts_enabled boolean DEFAULT false NOT NULL,
    client_authenticator_type character varying(255),
    root_url character varying(255),
    description character varying(255),
    registration_token character varying(255),
    standard_flow_enabled boolean DEFAULT true NOT NULL,
    implicit_flow_enabled boolean DEFAULT false NOT NULL,
    direct_access_grants_enabled boolean DEFAULT false NOT NULL,
    always_display_in_console boolean DEFAULT false NOT NULL
);


ALTER TABLE public.client OWNER TO keycloak;

--
-- Name: client_attributes; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_attributes (
    client_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


ALTER TABLE public.client_attributes OWNER TO keycloak;

--
-- Name: client_auth_flow_bindings; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_auth_flow_bindings (
    client_id character varying(36) NOT NULL,
    flow_id character varying(36),
    binding_name character varying(255) NOT NULL
);


ALTER TABLE public.client_auth_flow_bindings OWNER TO keycloak;

--
-- Name: client_initial_access; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_initial_access (
    id character varying(36) NOT NULL,
    realm_id character varying(36) NOT NULL,
    "timestamp" integer,
    expiration integer,
    count integer,
    remaining_count integer
);


ALTER TABLE public.client_initial_access OWNER TO keycloak;

--
-- Name: client_node_registrations; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_node_registrations (
    client_id character varying(36) NOT NULL,
    value integer,
    name character varying(255) NOT NULL
);


ALTER TABLE public.client_node_registrations OWNER TO keycloak;

--
-- Name: client_scope; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_scope (
    id character varying(36) NOT NULL,
    name character varying(255),
    realm_id character varying(36),
    description character varying(255),
    protocol character varying(255)
);


ALTER TABLE public.client_scope OWNER TO keycloak;

--
-- Name: client_scope_attributes; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_scope_attributes (
    scope_id character varying(36) NOT NULL,
    value character varying(2048),
    name character varying(255) NOT NULL
);


ALTER TABLE public.client_scope_attributes OWNER TO keycloak;

--
-- Name: client_scope_client; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_scope_client (
    client_id character varying(255) NOT NULL,
    scope_id character varying(255) NOT NULL,
    default_scope boolean DEFAULT false NOT NULL
);


ALTER TABLE public.client_scope_client OWNER TO keycloak;

--
-- Name: client_scope_role_mapping; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_scope_role_mapping (
    scope_id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL
);


ALTER TABLE public.client_scope_role_mapping OWNER TO keycloak;

--
-- Name: client_session; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_session (
    id character varying(36) NOT NULL,
    client_id character varying(36),
    redirect_uri character varying(255),
    state character varying(255),
    "timestamp" integer,
    session_id character varying(36),
    auth_method character varying(255),
    realm_id character varying(255),
    auth_user_id character varying(36),
    current_action character varying(36)
);


ALTER TABLE public.client_session OWNER TO keycloak;

--
-- Name: client_session_auth_status; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_session_auth_status (
    authenticator character varying(36) NOT NULL,
    status integer,
    client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_session_auth_status OWNER TO keycloak;

--
-- Name: client_session_note; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_session_note (
    name character varying(255) NOT NULL,
    value character varying(255),
    client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_session_note OWNER TO keycloak;

--
-- Name: client_session_prot_mapper; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_session_prot_mapper (
    protocol_mapper_id character varying(36) NOT NULL,
    client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_session_prot_mapper OWNER TO keycloak;

--
-- Name: client_session_role; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_session_role (
    role_id character varying(255) NOT NULL,
    client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_session_role OWNER TO keycloak;

--
-- Name: client_user_session_note; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.client_user_session_note (
    name character varying(255) NOT NULL,
    value character varying(2048),
    client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_user_session_note OWNER TO keycloak;

--
-- Name: component; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.component (
    id character varying(36) NOT NULL,
    name character varying(255),
    parent_id character varying(36),
    provider_id character varying(36),
    provider_type character varying(255),
    realm_id character varying(36),
    sub_type character varying(255)
);


ALTER TABLE public.component OWNER TO keycloak;

--
-- Name: component_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.component_config (
    id character varying(36) NOT NULL,
    component_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


ALTER TABLE public.component_config OWNER TO keycloak;

--
-- Name: composite_role; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.composite_role (
    composite character varying(36) NOT NULL,
    child_role character varying(36) NOT NULL
);


ALTER TABLE public.composite_role OWNER TO keycloak;

--
-- Name: credential; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.credential (
    id character varying(36) NOT NULL,
    salt bytea,
    type character varying(255),
    user_id character varying(36),
    created_date bigint,
    user_label character varying(255),
    secret_data text,
    credential_data text,
    priority integer
);


ALTER TABLE public.credential OWNER TO keycloak;

--
-- Name: databasechangelog; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.databasechangelog (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    dateexecuted timestamp without time zone NOT NULL,
    orderexecuted integer NOT NULL,
    exectype character varying(10) NOT NULL,
    md5sum character varying(35),
    description character varying(255),
    comments character varying(255),
    tag character varying(255),
    liquibase character varying(20),
    contexts character varying(255),
    labels character varying(255),
    deployment_id character varying(10)
);


ALTER TABLE public.databasechangelog OWNER TO keycloak;

--
-- Name: databasechangeloglock; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.databasechangeloglock (
    id integer NOT NULL,
    locked boolean NOT NULL,
    lockgranted timestamp without time zone,
    lockedby character varying(255)
);


ALTER TABLE public.databasechangeloglock OWNER TO keycloak;

--
-- Name: default_client_scope; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.default_client_scope (
    realm_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL,
    default_scope boolean DEFAULT false NOT NULL
);


ALTER TABLE public.default_client_scope OWNER TO keycloak;

--
-- Name: event_entity; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.event_entity (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    details_json character varying(2550),
    error character varying(255),
    ip_address character varying(255),
    realm_id character varying(255),
    session_id character varying(255),
    event_time bigint,
    type character varying(255),
    user_id character varying(255),
    details_json_long_value text
);


ALTER TABLE public.event_entity OWNER TO keycloak;

--
-- Name: fed_user_attribute; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.fed_user_attribute (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    value character varying(2024),
    long_value_hash bytea,
    long_value_hash_lower_case bytea,
    long_value text
);


ALTER TABLE public.fed_user_attribute OWNER TO keycloak;

--
-- Name: fed_user_consent; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.fed_user_consent (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    created_date bigint,
    last_updated_date bigint,
    client_storage_provider character varying(36),
    external_client_id character varying(255)
);


ALTER TABLE public.fed_user_consent OWNER TO keycloak;

--
-- Name: fed_user_consent_cl_scope; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.fed_user_consent_cl_scope (
    user_consent_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


ALTER TABLE public.fed_user_consent_cl_scope OWNER TO keycloak;

--
-- Name: fed_user_credential; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.fed_user_credential (
    id character varying(36) NOT NULL,
    salt bytea,
    type character varying(255),
    created_date bigint,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    user_label character varying(255),
    secret_data text,
    credential_data text,
    priority integer
);


ALTER TABLE public.fed_user_credential OWNER TO keycloak;

--
-- Name: fed_user_group_membership; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.fed_user_group_membership (
    group_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_group_membership OWNER TO keycloak;

--
-- Name: fed_user_required_action; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.fed_user_required_action (
    required_action character varying(255) DEFAULT ' '::character varying NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_required_action OWNER TO keycloak;

--
-- Name: fed_user_role_mapping; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.fed_user_role_mapping (
    role_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_role_mapping OWNER TO keycloak;

--
-- Name: federated_identity; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.federated_identity (
    identity_provider character varying(255) NOT NULL,
    realm_id character varying(36),
    federated_user_id character varying(255),
    federated_username character varying(255),
    token text,
    user_id character varying(36) NOT NULL
);


ALTER TABLE public.federated_identity OWNER TO keycloak;

--
-- Name: federated_user; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.federated_user (
    id character varying(255) NOT NULL,
    storage_provider_id character varying(255),
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.federated_user OWNER TO keycloak;

--
-- Name: group_attribute; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.group_attribute (
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    group_id character varying(36) NOT NULL
);


ALTER TABLE public.group_attribute OWNER TO keycloak;

--
-- Name: group_role_mapping; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.group_role_mapping (
    role_id character varying(36) NOT NULL,
    group_id character varying(36) NOT NULL
);


ALTER TABLE public.group_role_mapping OWNER TO keycloak;

--
-- Name: identity_provider; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.identity_provider (
    internal_id character varying(36) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    provider_alias character varying(255),
    provider_id character varying(255),
    store_token boolean DEFAULT false NOT NULL,
    authenticate_by_default boolean DEFAULT false NOT NULL,
    realm_id character varying(36),
    add_token_role boolean DEFAULT true NOT NULL,
    trust_email boolean DEFAULT false NOT NULL,
    first_broker_login_flow_id character varying(36),
    post_broker_login_flow_id character varying(36),
    provider_display_name character varying(255),
    link_only boolean DEFAULT false NOT NULL
);


ALTER TABLE public.identity_provider OWNER TO keycloak;

--
-- Name: identity_provider_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.identity_provider_config (
    identity_provider_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.identity_provider_config OWNER TO keycloak;

--
-- Name: identity_provider_mapper; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.identity_provider_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    idp_alias character varying(255) NOT NULL,
    idp_mapper_name character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.identity_provider_mapper OWNER TO keycloak;

--
-- Name: idp_mapper_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.idp_mapper_config (
    idp_mapper_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.idp_mapper_config OWNER TO keycloak;

--
-- Name: keycloak_group; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.keycloak_group (
    id character varying(36) NOT NULL,
    name character varying(255),
    parent_group character varying(36) NOT NULL,
    realm_id character varying(36)
);


ALTER TABLE public.keycloak_group OWNER TO keycloak;

--
-- Name: keycloak_role; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.keycloak_role (
    id character varying(36) NOT NULL,
    client_realm_constraint character varying(255),
    client_role boolean DEFAULT false NOT NULL,
    description character varying(255),
    name character varying(255),
    realm_id character varying(255),
    client character varying(36),
    realm character varying(36)
);


ALTER TABLE public.keycloak_role OWNER TO keycloak;

--
-- Name: migration_model; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.migration_model (
    id character varying(36) NOT NULL,
    version character varying(36),
    update_time bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public.migration_model OWNER TO keycloak;

--
-- Name: offline_client_session; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.offline_client_session (
    user_session_id character varying(36) NOT NULL,
    client_id character varying(255) NOT NULL,
    offline_flag character varying(4) NOT NULL,
    "timestamp" integer,
    data text,
    client_storage_provider character varying(36) DEFAULT 'local'::character varying NOT NULL,
    external_client_id character varying(255) DEFAULT 'local'::character varying NOT NULL
);


ALTER TABLE public.offline_client_session OWNER TO keycloak;

--
-- Name: offline_user_session; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.offline_user_session (
    user_session_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    created_on integer NOT NULL,
    offline_flag character varying(4) NOT NULL,
    data text,
    last_session_refresh integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.offline_user_session OWNER TO keycloak;

--
-- Name: policy_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.policy_config (
    policy_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


ALTER TABLE public.policy_config OWNER TO keycloak;

--
-- Name: protocol_mapper; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.protocol_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    protocol character varying(255) NOT NULL,
    protocol_mapper_name character varying(255) NOT NULL,
    client_id character varying(36),
    client_scope_id character varying(36)
);


ALTER TABLE public.protocol_mapper OWNER TO keycloak;

--
-- Name: protocol_mapper_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.protocol_mapper_config (
    protocol_mapper_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.protocol_mapper_config OWNER TO keycloak;

--
-- Name: realm; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.realm (
    id character varying(36) NOT NULL,
    access_code_lifespan integer,
    user_action_lifespan integer,
    access_token_lifespan integer,
    account_theme character varying(255),
    admin_theme character varying(255),
    email_theme character varying(255),
    enabled boolean DEFAULT false NOT NULL,
    events_enabled boolean DEFAULT false NOT NULL,
    events_expiration bigint,
    login_theme character varying(255),
    name character varying(255),
    not_before integer,
    password_policy character varying(2550),
    registration_allowed boolean DEFAULT false NOT NULL,
    remember_me boolean DEFAULT false NOT NULL,
    reset_password_allowed boolean DEFAULT false NOT NULL,
    social boolean DEFAULT false NOT NULL,
    ssl_required character varying(255),
    sso_idle_timeout integer,
    sso_max_lifespan integer,
    update_profile_on_soc_login boolean DEFAULT false NOT NULL,
    verify_email boolean DEFAULT false NOT NULL,
    master_admin_client character varying(36),
    login_lifespan integer,
    internationalization_enabled boolean DEFAULT false NOT NULL,
    default_locale character varying(255),
    reg_email_as_username boolean DEFAULT false NOT NULL,
    admin_events_enabled boolean DEFAULT false NOT NULL,
    admin_events_details_enabled boolean DEFAULT false NOT NULL,
    edit_username_allowed boolean DEFAULT false NOT NULL,
    otp_policy_counter integer DEFAULT 0,
    otp_policy_window integer DEFAULT 1,
    otp_policy_period integer DEFAULT 30,
    otp_policy_digits integer DEFAULT 6,
    otp_policy_alg character varying(36) DEFAULT 'HmacSHA1'::character varying,
    otp_policy_type character varying(36) DEFAULT 'totp'::character varying,
    browser_flow character varying(36),
    registration_flow character varying(36),
    direct_grant_flow character varying(36),
    reset_credentials_flow character varying(36),
    client_auth_flow character varying(36),
    offline_session_idle_timeout integer DEFAULT 0,
    revoke_refresh_token boolean DEFAULT false NOT NULL,
    access_token_life_implicit integer DEFAULT 0,
    login_with_email_allowed boolean DEFAULT true NOT NULL,
    duplicate_emails_allowed boolean DEFAULT false NOT NULL,
    docker_auth_flow character varying(36),
    refresh_token_max_reuse integer DEFAULT 0,
    allow_user_managed_access boolean DEFAULT false NOT NULL,
    sso_max_lifespan_remember_me integer DEFAULT 0 NOT NULL,
    sso_idle_timeout_remember_me integer DEFAULT 0 NOT NULL,
    default_role character varying(255)
);


ALTER TABLE public.realm OWNER TO keycloak;

--
-- Name: realm_attribute; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.realm_attribute (
    name character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    value text
);


ALTER TABLE public.realm_attribute OWNER TO keycloak;

--
-- Name: realm_default_groups; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.realm_default_groups (
    realm_id character varying(36) NOT NULL,
    group_id character varying(36) NOT NULL
);


ALTER TABLE public.realm_default_groups OWNER TO keycloak;

--
-- Name: realm_enabled_event_types; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.realm_enabled_event_types (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.realm_enabled_event_types OWNER TO keycloak;

--
-- Name: realm_events_listeners; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.realm_events_listeners (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.realm_events_listeners OWNER TO keycloak;

--
-- Name: realm_localizations; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.realm_localizations (
    realm_id character varying(255) NOT NULL,
    locale character varying(255) NOT NULL,
    texts text NOT NULL
);


ALTER TABLE public.realm_localizations OWNER TO keycloak;

--
-- Name: realm_required_credential; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.realm_required_credential (
    type character varying(255) NOT NULL,
    form_label character varying(255),
    input boolean DEFAULT false NOT NULL,
    secret boolean DEFAULT false NOT NULL,
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.realm_required_credential OWNER TO keycloak;

--
-- Name: realm_smtp_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.realm_smtp_config (
    realm_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.realm_smtp_config OWNER TO keycloak;

--
-- Name: realm_supported_locales; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.realm_supported_locales (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.realm_supported_locales OWNER TO keycloak;

--
-- Name: redirect_uris; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.redirect_uris (
    client_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.redirect_uris OWNER TO keycloak;

--
-- Name: required_action_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.required_action_config (
    required_action_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


ALTER TABLE public.required_action_config OWNER TO keycloak;

--
-- Name: required_action_provider; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.required_action_provider (
    id character varying(36) NOT NULL,
    alias character varying(255),
    name character varying(255),
    realm_id character varying(36),
    enabled boolean DEFAULT false NOT NULL,
    default_action boolean DEFAULT false NOT NULL,
    provider_id character varying(255),
    priority integer
);


ALTER TABLE public.required_action_provider OWNER TO keycloak;

--
-- Name: resource_attribute; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.resource_attribute (
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    resource_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_attribute OWNER TO keycloak;

--
-- Name: resource_policy; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.resource_policy (
    resource_id character varying(36) NOT NULL,
    policy_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_policy OWNER TO keycloak;

--
-- Name: resource_scope; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.resource_scope (
    resource_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_scope OWNER TO keycloak;

--
-- Name: resource_server; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.resource_server (
    id character varying(36) NOT NULL,
    allow_rs_remote_mgmt boolean DEFAULT false NOT NULL,
    policy_enforce_mode smallint NOT NULL,
    decision_strategy smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.resource_server OWNER TO keycloak;

--
-- Name: resource_server_perm_ticket; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.resource_server_perm_ticket (
    id character varying(36) NOT NULL,
    owner character varying(255) NOT NULL,
    requester character varying(255) NOT NULL,
    created_timestamp bigint NOT NULL,
    granted_timestamp bigint,
    resource_id character varying(36) NOT NULL,
    scope_id character varying(36),
    resource_server_id character varying(36) NOT NULL,
    policy_id character varying(36)
);


ALTER TABLE public.resource_server_perm_ticket OWNER TO keycloak;

--
-- Name: resource_server_policy; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.resource_server_policy (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    type character varying(255) NOT NULL,
    decision_strategy smallint,
    logic smallint,
    resource_server_id character varying(36) NOT NULL,
    owner character varying(255)
);


ALTER TABLE public.resource_server_policy OWNER TO keycloak;

--
-- Name: resource_server_resource; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.resource_server_resource (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(255),
    icon_uri character varying(255),
    owner character varying(255) NOT NULL,
    resource_server_id character varying(36) NOT NULL,
    owner_managed_access boolean DEFAULT false NOT NULL,
    display_name character varying(255)
);


ALTER TABLE public.resource_server_resource OWNER TO keycloak;

--
-- Name: resource_server_scope; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.resource_server_scope (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    icon_uri character varying(255),
    resource_server_id character varying(36) NOT NULL,
    display_name character varying(255)
);


ALTER TABLE public.resource_server_scope OWNER TO keycloak;

--
-- Name: resource_uris; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.resource_uris (
    resource_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.resource_uris OWNER TO keycloak;

--
-- Name: role_attribute; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.role_attribute (
    id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255)
);


ALTER TABLE public.role_attribute OWNER TO keycloak;

--
-- Name: scope_mapping; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.scope_mapping (
    client_id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL
);


ALTER TABLE public.scope_mapping OWNER TO keycloak;

--
-- Name: scope_policy; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.scope_policy (
    scope_id character varying(36) NOT NULL,
    policy_id character varying(36) NOT NULL
);


ALTER TABLE public.scope_policy OWNER TO keycloak;

--
-- Name: user_attribute; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_attribute (
    name character varying(255) NOT NULL,
    value character varying(255),
    user_id character varying(36) NOT NULL,
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    long_value_hash bytea,
    long_value_hash_lower_case bytea,
    long_value text
);


ALTER TABLE public.user_attribute OWNER TO keycloak;

--
-- Name: user_consent; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_consent (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    user_id character varying(36) NOT NULL,
    created_date bigint,
    last_updated_date bigint,
    client_storage_provider character varying(36),
    external_client_id character varying(255)
);


ALTER TABLE public.user_consent OWNER TO keycloak;

--
-- Name: user_consent_client_scope; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_consent_client_scope (
    user_consent_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


ALTER TABLE public.user_consent_client_scope OWNER TO keycloak;

--
-- Name: user_entity; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_entity (
    id character varying(36) NOT NULL,
    email character varying(255),
    email_constraint character varying(255),
    email_verified boolean DEFAULT false NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    federation_link character varying(255),
    first_name character varying(255),
    last_name character varying(255),
    realm_id character varying(255),
    username character varying(255),
    created_timestamp bigint,
    service_account_client_link character varying(255),
    not_before integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.user_entity OWNER TO keycloak;

--
-- Name: user_federation_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_federation_config (
    user_federation_provider_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.user_federation_config OWNER TO keycloak;

--
-- Name: user_federation_mapper; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_federation_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    federation_provider_id character varying(36) NOT NULL,
    federation_mapper_type character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL
);


ALTER TABLE public.user_federation_mapper OWNER TO keycloak;

--
-- Name: user_federation_mapper_config; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_federation_mapper_config (
    user_federation_mapper_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.user_federation_mapper_config OWNER TO keycloak;

--
-- Name: user_federation_provider; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_federation_provider (
    id character varying(36) NOT NULL,
    changed_sync_period integer,
    display_name character varying(255),
    full_sync_period integer,
    last_sync integer,
    priority integer,
    provider_name character varying(255),
    realm_id character varying(36)
);


ALTER TABLE public.user_federation_provider OWNER TO keycloak;

--
-- Name: user_group_membership; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_group_membership (
    group_id character varying(36) NOT NULL,
    user_id character varying(36) NOT NULL
);


ALTER TABLE public.user_group_membership OWNER TO keycloak;

--
-- Name: user_required_action; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_required_action (
    user_id character varying(36) NOT NULL,
    required_action character varying(255) DEFAULT ' '::character varying NOT NULL
);


ALTER TABLE public.user_required_action OWNER TO keycloak;

--
-- Name: user_role_mapping; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_role_mapping (
    role_id character varying(255) NOT NULL,
    user_id character varying(36) NOT NULL
);


ALTER TABLE public.user_role_mapping OWNER TO keycloak;

--
-- Name: user_session; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_session (
    id character varying(36) NOT NULL,
    auth_method character varying(255),
    ip_address character varying(255),
    last_session_refresh integer,
    login_username character varying(255),
    realm_id character varying(255),
    remember_me boolean DEFAULT false NOT NULL,
    started integer,
    user_id character varying(255),
    user_session_state integer,
    broker_session_id character varying(255),
    broker_user_id character varying(255)
);


ALTER TABLE public.user_session OWNER TO keycloak;

--
-- Name: user_session_note; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.user_session_note (
    user_session character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(2048)
);


ALTER TABLE public.user_session_note OWNER TO keycloak;

--
-- Name: username_login_failure; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.username_login_failure (
    realm_id character varying(36) NOT NULL,
    username character varying(255) NOT NULL,
    failed_login_not_before integer,
    last_failure bigint,
    last_ip_failure character varying(255),
    num_failures integer
);


ALTER TABLE public.username_login_failure OWNER TO keycloak;

--
-- Name: web_origins; Type: TABLE; Schema: public; Owner: keycloak
--

CREATE TABLE public.web_origins (
    client_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.web_origins OWNER TO keycloak;

--
-- Data for Name: admin_event_entity; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.admin_event_entity (id, admin_event_time, realm_id, operation_type, auth_realm_id, auth_client_id, auth_user_id, ip_address, resource_path, representation, error, resource_type) FROM stdin;
\.


--
-- Data for Name: associated_policy; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.associated_policy (policy_id, associated_policy_id) FROM stdin;
\.


--
-- Data for Name: authentication_execution; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.authentication_execution (id, alias, authenticator, realm_id, flow_id, requirement, priority, authenticator_flow, auth_flow_id, auth_config) FROM stdin;
f0829dcb-92ff-4456-a9e5-6adc7a274d85	\N	auth-cookie	767d9b8d-d1e0-46e8-8336-872e7ee443dd	b36c966b-92ac-4567-aaff-dda8c9cbdb1c	2	10	f	\N	\N
610dc6ef-f73a-4acc-8bb6-f7b5db607159	\N	auth-spnego	767d9b8d-d1e0-46e8-8336-872e7ee443dd	b36c966b-92ac-4567-aaff-dda8c9cbdb1c	3	20	f	\N	\N
659667aa-123c-4ace-94dd-54aa998616ce	\N	identity-provider-redirector	767d9b8d-d1e0-46e8-8336-872e7ee443dd	b36c966b-92ac-4567-aaff-dda8c9cbdb1c	2	25	f	\N	\N
80d70dbf-c708-43b0-bde2-59c78d96b622	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	b36c966b-92ac-4567-aaff-dda8c9cbdb1c	2	30	t	37152b53-4ed5-474b-b5a3-2008d0447792	\N
e9d99147-452a-46b6-8647-7c9435c26a58	\N	auth-username-password-form	767d9b8d-d1e0-46e8-8336-872e7ee443dd	37152b53-4ed5-474b-b5a3-2008d0447792	0	10	f	\N	\N
7369afd9-0df5-416b-856c-343a4734108a	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	37152b53-4ed5-474b-b5a3-2008d0447792	1	20	t	5457a63f-f58e-4c9f-96c2-f4da20b34d41	\N
d634436c-30e4-4972-8298-b8e38c0c0c35	\N	conditional-user-configured	767d9b8d-d1e0-46e8-8336-872e7ee443dd	5457a63f-f58e-4c9f-96c2-f4da20b34d41	0	10	f	\N	\N
8a276dfa-c487-44a9-8b2e-82bb10ce384b	\N	auth-otp-form	767d9b8d-d1e0-46e8-8336-872e7ee443dd	5457a63f-f58e-4c9f-96c2-f4da20b34d41	0	20	f	\N	\N
1a232044-d008-4f7d-8225-bcacd651e679	\N	direct-grant-validate-username	767d9b8d-d1e0-46e8-8336-872e7ee443dd	ca82d390-f8c8-4105-9f7f-95f0442a4563	0	10	f	\N	\N
1567061e-b4e2-4eee-b036-8ef2a7bd6c95	\N	direct-grant-validate-password	767d9b8d-d1e0-46e8-8336-872e7ee443dd	ca82d390-f8c8-4105-9f7f-95f0442a4563	0	20	f	\N	\N
cdcadcea-0ab0-4caf-9a8c-94887bbb0c48	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	ca82d390-f8c8-4105-9f7f-95f0442a4563	1	30	t	4291e12f-4ec9-42cd-8c8a-062aefd541a3	\N
61fa555c-cdcd-4069-bf4a-cbe44cd69bb9	\N	conditional-user-configured	767d9b8d-d1e0-46e8-8336-872e7ee443dd	4291e12f-4ec9-42cd-8c8a-062aefd541a3	0	10	f	\N	\N
06455974-4516-4a8c-8ca0-c307a1f4b192	\N	direct-grant-validate-otp	767d9b8d-d1e0-46e8-8336-872e7ee443dd	4291e12f-4ec9-42cd-8c8a-062aefd541a3	0	20	f	\N	\N
18bd1364-f2af-4aa1-9290-045abbe80d00	\N	registration-page-form	767d9b8d-d1e0-46e8-8336-872e7ee443dd	21f9d306-af32-481c-9470-875328ef651d	0	10	t	1f914244-4fde-42fd-b6d0-1a0457835265	\N
6af17412-e2b9-43cd-8b42-a30ffdaa5a0d	\N	registration-user-creation	767d9b8d-d1e0-46e8-8336-872e7ee443dd	1f914244-4fde-42fd-b6d0-1a0457835265	0	20	f	\N	\N
ce3de24e-f961-43a1-ba63-54fe433de282	\N	registration-password-action	767d9b8d-d1e0-46e8-8336-872e7ee443dd	1f914244-4fde-42fd-b6d0-1a0457835265	0	50	f	\N	\N
3539a58c-c969-42ef-8e24-a3b8158750f1	\N	registration-recaptcha-action	767d9b8d-d1e0-46e8-8336-872e7ee443dd	1f914244-4fde-42fd-b6d0-1a0457835265	3	60	f	\N	\N
a32285d8-9738-4463-9db4-5f35a0c3f2a4	\N	registration-terms-and-conditions	767d9b8d-d1e0-46e8-8336-872e7ee443dd	1f914244-4fde-42fd-b6d0-1a0457835265	3	70	f	\N	\N
363c8eb2-bfcd-4f25-a84c-c01a06e15f83	\N	reset-credentials-choose-user	767d9b8d-d1e0-46e8-8336-872e7ee443dd	0f7db7b2-9608-4396-9da7-5ac0d23298e2	0	10	f	\N	\N
bdf83dbd-1b54-456d-a93c-9f00428da58d	\N	reset-credential-email	767d9b8d-d1e0-46e8-8336-872e7ee443dd	0f7db7b2-9608-4396-9da7-5ac0d23298e2	0	20	f	\N	\N
14671b49-785c-4b6e-b950-4dee3c5a46bc	\N	reset-password	767d9b8d-d1e0-46e8-8336-872e7ee443dd	0f7db7b2-9608-4396-9da7-5ac0d23298e2	0	30	f	\N	\N
d52e3aaa-31b2-4cfb-9397-ab4d2ee0e2b4	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	0f7db7b2-9608-4396-9da7-5ac0d23298e2	1	40	t	eac7d096-07c5-4ab1-86ab-d7671c40ae6f	\N
2b981614-edce-48c3-b173-53d948019683	\N	conditional-user-configured	767d9b8d-d1e0-46e8-8336-872e7ee443dd	eac7d096-07c5-4ab1-86ab-d7671c40ae6f	0	10	f	\N	\N
d2abe5b3-8b2d-4331-ae8d-32377fcd8ab2	\N	reset-otp	767d9b8d-d1e0-46e8-8336-872e7ee443dd	eac7d096-07c5-4ab1-86ab-d7671c40ae6f	0	20	f	\N	\N
e6e4e763-68be-42ea-9650-d0a91a6d1bb7	\N	client-secret	767d9b8d-d1e0-46e8-8336-872e7ee443dd	4166758c-a967-44ea-a50a-aead01198481	2	10	f	\N	\N
93e25e1d-1bb3-419d-a865-caed652bd18e	\N	client-jwt	767d9b8d-d1e0-46e8-8336-872e7ee443dd	4166758c-a967-44ea-a50a-aead01198481	2	20	f	\N	\N
e6bd8e68-195a-4be4-b3a4-1f1f5f0cdc72	\N	client-secret-jwt	767d9b8d-d1e0-46e8-8336-872e7ee443dd	4166758c-a967-44ea-a50a-aead01198481	2	30	f	\N	\N
074a8baa-634e-42cc-90d1-e44c08e2acbc	\N	client-x509	767d9b8d-d1e0-46e8-8336-872e7ee443dd	4166758c-a967-44ea-a50a-aead01198481	2	40	f	\N	\N
e91fcfec-e5c3-4ef8-af9c-9c9125fb0488	\N	idp-review-profile	767d9b8d-d1e0-46e8-8336-872e7ee443dd	c0358ec7-d894-4538-a00a-0564f3ad55e5	0	10	f	\N	313de56f-94bc-414f-a07b-8dcf9863d112
7edb5f36-ba5c-4498-9656-ad4eb3051a58	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	c0358ec7-d894-4538-a00a-0564f3ad55e5	0	20	t	c36b58e5-7ecc-47ee-bc1e-8f57564c0ba4	\N
b962b063-251f-4f09-bbb1-d751ed427120	\N	idp-create-user-if-unique	767d9b8d-d1e0-46e8-8336-872e7ee443dd	c36b58e5-7ecc-47ee-bc1e-8f57564c0ba4	2	10	f	\N	4f14fbda-df74-4e0b-bb3c-2a5c1453e19e
4aa39619-8a72-4421-8cd5-79058f12e942	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	c36b58e5-7ecc-47ee-bc1e-8f57564c0ba4	2	20	t	88c69553-e86b-46a4-b050-f6ae45fc7e34	\N
afe1edb2-a446-4c27-a2aa-b203e151cd22	\N	idp-confirm-link	767d9b8d-d1e0-46e8-8336-872e7ee443dd	88c69553-e86b-46a4-b050-f6ae45fc7e34	0	10	f	\N	\N
11407830-fad2-4a9e-9c03-4e06d0dd5612	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	88c69553-e86b-46a4-b050-f6ae45fc7e34	0	20	t	a56987cd-1b01-40c4-986b-d907fd49f9d8	\N
8fb247d5-8c1c-483f-86c7-84342dbb2b1f	\N	idp-email-verification	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a56987cd-1b01-40c4-986b-d907fd49f9d8	2	10	f	\N	\N
68b6071c-8d31-4550-8940-08b3452326cf	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a56987cd-1b01-40c4-986b-d907fd49f9d8	2	20	t	28531d8b-e767-466d-962e-114a67a31e64	\N
10530847-ef12-4b2c-8d94-68c557562829	\N	idp-username-password-form	767d9b8d-d1e0-46e8-8336-872e7ee443dd	28531d8b-e767-466d-962e-114a67a31e64	0	10	f	\N	\N
1fc8853c-358a-473f-b421-a8877f0fcec1	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	28531d8b-e767-466d-962e-114a67a31e64	1	20	t	7d95d05c-a9aa-40b3-be2b-884db4074e0c	\N
a15a9ad6-07f9-419f-8a10-5f3d39d25ab0	\N	conditional-user-configured	767d9b8d-d1e0-46e8-8336-872e7ee443dd	7d95d05c-a9aa-40b3-be2b-884db4074e0c	0	10	f	\N	\N
b7162a34-5b5d-4c8c-8716-a1b5619d5c5b	\N	auth-otp-form	767d9b8d-d1e0-46e8-8336-872e7ee443dd	7d95d05c-a9aa-40b3-be2b-884db4074e0c	0	20	f	\N	\N
28ca7b6f-c4a4-483a-8d3e-c414407a600d	\N	http-basic-authenticator	767d9b8d-d1e0-46e8-8336-872e7ee443dd	fb896d9b-8940-403e-b37c-dca4551a89d8	0	10	f	\N	\N
a79fb6c9-9528-49b3-9093-34cd5328eca5	\N	docker-http-basic-authenticator	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a9628e8a-0970-4232-9624-8e717c21b27f	0	10	f	\N	\N
fd9e7ebd-d32c-4afe-a2a9-d634ee1ba05e	\N	auth-cookie	44e4f427-7bb6-413b-a887-fff03fedb6fb	b636c7d9-f0ce-43a1-a442-9675acf8074a	2	10	f	\N	\N
46fa40c9-c2a1-489c-bafa-f33cfca9ce5d	\N	auth-spnego	44e4f427-7bb6-413b-a887-fff03fedb6fb	b636c7d9-f0ce-43a1-a442-9675acf8074a	3	20	f	\N	\N
d1a0d7bc-3d41-4a0e-8494-732513f23c56	\N	identity-provider-redirector	44e4f427-7bb6-413b-a887-fff03fedb6fb	b636c7d9-f0ce-43a1-a442-9675acf8074a	2	25	f	\N	\N
d4283f7d-caf4-44c0-8e74-d698ddebc96d	\N	\N	44e4f427-7bb6-413b-a887-fff03fedb6fb	b636c7d9-f0ce-43a1-a442-9675acf8074a	2	30	t	3f6d5c6c-e6e8-4f74-94a9-fc1866dda617	\N
2ae1516d-0160-4813-aa46-66f7eb10ed4f	\N	auth-username-password-form	44e4f427-7bb6-413b-a887-fff03fedb6fb	3f6d5c6c-e6e8-4f74-94a9-fc1866dda617	0	10	f	\N	\N
75dcaf32-4978-4b51-8608-fb2ec793ab4e	\N	\N	44e4f427-7bb6-413b-a887-fff03fedb6fb	3f6d5c6c-e6e8-4f74-94a9-fc1866dda617	1	20	t	97cea84d-3635-47f1-a7cd-de3b043dc28e	\N
c8e2c1ac-bc82-4c18-95f4-f89713cbb370	\N	conditional-user-configured	44e4f427-7bb6-413b-a887-fff03fedb6fb	97cea84d-3635-47f1-a7cd-de3b043dc28e	0	10	f	\N	\N
cea000d8-13a3-4b80-a7ec-3c093aa20ef9	\N	auth-otp-form	44e4f427-7bb6-413b-a887-fff03fedb6fb	97cea84d-3635-47f1-a7cd-de3b043dc28e	0	20	f	\N	\N
f9e6196c-5e23-4fe3-8c21-a28aeed170e8	\N	direct-grant-validate-username	44e4f427-7bb6-413b-a887-fff03fedb6fb	d30a5765-2803-440e-b61f-e0085e2e6ff4	0	10	f	\N	\N
db397441-e07b-469a-9362-c94749a0047a	\N	direct-grant-validate-password	44e4f427-7bb6-413b-a887-fff03fedb6fb	d30a5765-2803-440e-b61f-e0085e2e6ff4	0	20	f	\N	\N
ddf557dc-1af4-4444-b48d-27949aa61a4b	\N	\N	44e4f427-7bb6-413b-a887-fff03fedb6fb	d30a5765-2803-440e-b61f-e0085e2e6ff4	1	30	t	1fd714fe-47ad-4622-a3ef-15fbd2bb4464	\N
27966f85-71bb-4c72-9674-bf30ceb80c3d	\N	conditional-user-configured	44e4f427-7bb6-413b-a887-fff03fedb6fb	1fd714fe-47ad-4622-a3ef-15fbd2bb4464	0	10	f	\N	\N
10cd7f32-7897-478e-bde9-1fd33b09cb46	\N	direct-grant-validate-otp	44e4f427-7bb6-413b-a887-fff03fedb6fb	1fd714fe-47ad-4622-a3ef-15fbd2bb4464	0	20	f	\N	\N
00672f83-ae8c-4972-b31f-02204f84c1ed	\N	registration-page-form	44e4f427-7bb6-413b-a887-fff03fedb6fb	9350a0ab-309b-40ef-8237-4aa7b02183b7	0	10	t	cc2f615d-3f9c-4ae3-a66c-ab7f22c932ad	\N
ae982ad1-2c5d-4145-ab27-ebce1304109d	\N	registration-user-creation	44e4f427-7bb6-413b-a887-fff03fedb6fb	cc2f615d-3f9c-4ae3-a66c-ab7f22c932ad	0	20	f	\N	\N
de68c9f3-d813-47ab-b554-20d7cc5ca7bc	\N	registration-password-action	44e4f427-7bb6-413b-a887-fff03fedb6fb	cc2f615d-3f9c-4ae3-a66c-ab7f22c932ad	0	50	f	\N	\N
8e2d9667-1416-4bfc-856a-59f3379db760	\N	registration-recaptcha-action	44e4f427-7bb6-413b-a887-fff03fedb6fb	cc2f615d-3f9c-4ae3-a66c-ab7f22c932ad	3	60	f	\N	\N
095769ee-00b7-46c9-a9d4-e0c065802709	\N	registration-terms-and-conditions	44e4f427-7bb6-413b-a887-fff03fedb6fb	cc2f615d-3f9c-4ae3-a66c-ab7f22c932ad	3	70	f	\N	\N
0fd41aaa-63ca-4f02-8221-7ae31b23a6c5	\N	reset-credentials-choose-user	44e4f427-7bb6-413b-a887-fff03fedb6fb	1775b658-b1c3-4d25-bafd-750a712bf0e7	0	10	f	\N	\N
fa4e3337-1baa-4ac0-a7f1-8855d75e5f58	\N	reset-credential-email	44e4f427-7bb6-413b-a887-fff03fedb6fb	1775b658-b1c3-4d25-bafd-750a712bf0e7	0	20	f	\N	\N
b0ca1dbb-90a3-4b5e-8792-089e1865161f	\N	reset-password	44e4f427-7bb6-413b-a887-fff03fedb6fb	1775b658-b1c3-4d25-bafd-750a712bf0e7	0	30	f	\N	\N
b63898c2-4ce9-4575-9abc-784d54d27aae	\N	\N	44e4f427-7bb6-413b-a887-fff03fedb6fb	1775b658-b1c3-4d25-bafd-750a712bf0e7	1	40	t	e41df889-4a0c-4d76-b0d7-b569711433dc	\N
e9839c55-bbda-4d96-97c5-6435b7f20065	\N	conditional-user-configured	44e4f427-7bb6-413b-a887-fff03fedb6fb	e41df889-4a0c-4d76-b0d7-b569711433dc	0	10	f	\N	\N
8df26635-a3d7-456b-8b03-bbee29d00225	\N	reset-otp	44e4f427-7bb6-413b-a887-fff03fedb6fb	e41df889-4a0c-4d76-b0d7-b569711433dc	0	20	f	\N	\N
a3f6599c-441b-42d7-99e6-7c508a176415	\N	client-secret	44e4f427-7bb6-413b-a887-fff03fedb6fb	e33ecdd3-53a9-454a-9394-ca502237819f	2	10	f	\N	\N
69b8b2e0-3383-4018-a4e9-1e4998e43edb	\N	client-jwt	44e4f427-7bb6-413b-a887-fff03fedb6fb	e33ecdd3-53a9-454a-9394-ca502237819f	2	20	f	\N	\N
323ee3b5-de59-4f35-a8c8-b920e82659cf	\N	client-secret-jwt	44e4f427-7bb6-413b-a887-fff03fedb6fb	e33ecdd3-53a9-454a-9394-ca502237819f	2	30	f	\N	\N
57129d9b-7717-4dc4-84f9-efcbee140045	\N	client-x509	44e4f427-7bb6-413b-a887-fff03fedb6fb	e33ecdd3-53a9-454a-9394-ca502237819f	2	40	f	\N	\N
0998e75b-5b2a-4d89-85ab-85fe03bc975a	\N	idp-review-profile	44e4f427-7bb6-413b-a887-fff03fedb6fb	1ce9cebf-4d68-48fc-a17f-70afb10ac2a7	0	10	f	\N	45d8ab35-66f3-4136-8b1c-2f032ca0d53a
e8868d42-7294-482a-9e2a-16242ae7b836	\N	\N	44e4f427-7bb6-413b-a887-fff03fedb6fb	1ce9cebf-4d68-48fc-a17f-70afb10ac2a7	0	20	t	3e9c9283-e3b7-4d40-b47d-6c5af4068831	\N
e9fd4552-d28c-4c56-84da-acc5721861c3	\N	idp-create-user-if-unique	44e4f427-7bb6-413b-a887-fff03fedb6fb	3e9c9283-e3b7-4d40-b47d-6c5af4068831	2	10	f	\N	80136f9a-9714-4365-ac2b-f0b234bfe185
a1561faa-0b30-4a14-977c-043fd5f2829c	\N	\N	44e4f427-7bb6-413b-a887-fff03fedb6fb	3e9c9283-e3b7-4d40-b47d-6c5af4068831	2	20	t	d6e196a6-df75-4f0f-9320-922ac4a56b05	\N
724a2f4a-f025-4eda-b3ee-f72ab886b3c7	\N	idp-confirm-link	44e4f427-7bb6-413b-a887-fff03fedb6fb	d6e196a6-df75-4f0f-9320-922ac4a56b05	0	10	f	\N	\N
9227deb0-743e-4168-9562-2d1d6e30c7ae	\N	\N	44e4f427-7bb6-413b-a887-fff03fedb6fb	d6e196a6-df75-4f0f-9320-922ac4a56b05	0	20	t	85cb2e3b-bd7f-4b9b-bb28-f273aa358dad	\N
7786d2d3-7178-4ee6-a0d4-32fc33841159	\N	idp-email-verification	44e4f427-7bb6-413b-a887-fff03fedb6fb	85cb2e3b-bd7f-4b9b-bb28-f273aa358dad	2	10	f	\N	\N
e28a2a9b-a7a3-4b76-961f-91b1544efbfb	\N	\N	44e4f427-7bb6-413b-a887-fff03fedb6fb	85cb2e3b-bd7f-4b9b-bb28-f273aa358dad	2	20	t	f6b8397a-fa04-451a-a089-792bf1868b25	\N
c698919b-6264-4e72-99e4-b98c43a7eae4	\N	idp-username-password-form	44e4f427-7bb6-413b-a887-fff03fedb6fb	f6b8397a-fa04-451a-a089-792bf1868b25	0	10	f	\N	\N
72dc5b0e-c2f5-493b-9c0c-7cbdb0aeb14f	\N	\N	44e4f427-7bb6-413b-a887-fff03fedb6fb	f6b8397a-fa04-451a-a089-792bf1868b25	1	20	t	5c46cd00-4860-439f-9a4d-dcd7cccc6b0c	\N
4a6df999-f35d-44dd-89f1-2b7a5e372cc9	\N	conditional-user-configured	44e4f427-7bb6-413b-a887-fff03fedb6fb	5c46cd00-4860-439f-9a4d-dcd7cccc6b0c	0	10	f	\N	\N
165bbbbe-b515-489c-a04a-750b9b45c1bd	\N	auth-otp-form	44e4f427-7bb6-413b-a887-fff03fedb6fb	5c46cd00-4860-439f-9a4d-dcd7cccc6b0c	0	20	f	\N	\N
85c9dee0-6592-4664-b3c9-b7c164e9d61b	\N	http-basic-authenticator	44e4f427-7bb6-413b-a887-fff03fedb6fb	6513e3a6-0253-44fc-bd5f-81c4d1c4fa14	0	10	f	\N	\N
df37abcc-bd10-4075-9ccc-c3bcad7dcca8	\N	docker-http-basic-authenticator	44e4f427-7bb6-413b-a887-fff03fedb6fb	32554854-cb8b-4602-9d7c-c1bf712bc2d3	0	10	f	\N	\N
\.


--
-- Data for Name: authentication_flow; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.authentication_flow (id, alias, description, realm_id, provider_id, top_level, built_in) FROM stdin;
b36c966b-92ac-4567-aaff-dda8c9cbdb1c	browser	browser based authentication	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	t	t
37152b53-4ed5-474b-b5a3-2008d0447792	forms	Username, password, otp and other auth forms.	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	f	t
5457a63f-f58e-4c9f-96c2-f4da20b34d41	Browser - Conditional OTP	Flow to determine if the OTP is required for the authentication	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	f	t
ca82d390-f8c8-4105-9f7f-95f0442a4563	direct grant	OpenID Connect Resource Owner Grant	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	t	t
4291e12f-4ec9-42cd-8c8a-062aefd541a3	Direct Grant - Conditional OTP	Flow to determine if the OTP is required for the authentication	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	f	t
21f9d306-af32-481c-9470-875328ef651d	registration	registration flow	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	t	t
1f914244-4fde-42fd-b6d0-1a0457835265	registration form	registration form	767d9b8d-d1e0-46e8-8336-872e7ee443dd	form-flow	f	t
0f7db7b2-9608-4396-9da7-5ac0d23298e2	reset credentials	Reset credentials for a user if they forgot their password or something	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	t	t
eac7d096-07c5-4ab1-86ab-d7671c40ae6f	Reset - Conditional OTP	Flow to determine if the OTP should be reset or not. Set to REQUIRED to force.	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	f	t
4166758c-a967-44ea-a50a-aead01198481	clients	Base authentication for clients	767d9b8d-d1e0-46e8-8336-872e7ee443dd	client-flow	t	t
c0358ec7-d894-4538-a00a-0564f3ad55e5	first broker login	Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	t	t
c36b58e5-7ecc-47ee-bc1e-8f57564c0ba4	User creation or linking	Flow for the existing/non-existing user alternatives	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	f	t
88c69553-e86b-46a4-b050-f6ae45fc7e34	Handle Existing Account	Handle what to do if there is existing account with same email/username like authenticated identity provider	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	f	t
a56987cd-1b01-40c4-986b-d907fd49f9d8	Account verification options	Method with which to verity the existing account	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	f	t
28531d8b-e767-466d-962e-114a67a31e64	Verify Existing Account by Re-authentication	Reauthentication of existing account	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	f	t
7d95d05c-a9aa-40b3-be2b-884db4074e0c	First broker login - Conditional OTP	Flow to determine if the OTP is required for the authentication	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	f	t
fb896d9b-8940-403e-b37c-dca4551a89d8	saml ecp	SAML ECP Profile Authentication Flow	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	t	t
a9628e8a-0970-4232-9624-8e717c21b27f	docker auth	Used by Docker clients to authenticate against the IDP	767d9b8d-d1e0-46e8-8336-872e7ee443dd	basic-flow	t	t
b636c7d9-f0ce-43a1-a442-9675acf8074a	browser	browser based authentication	44e4f427-7bb6-413b-a887-fff03fedb6fb	basic-flow	t	t
3f6d5c6c-e6e8-4f74-94a9-fc1866dda617	forms	Username, password, otp and other auth forms.	44e4f427-7bb6-413b-a887-fff03fedb6fb	basic-flow	f	t
97cea84d-3635-47f1-a7cd-de3b043dc28e	Browser - Conditional OTP	Flow to determine if the OTP is required for the authentication	44e4f427-7bb6-413b-a887-fff03fedb6fb	basic-flow	f	t
d30a5765-2803-440e-b61f-e0085e2e6ff4	direct grant	OpenID Connect Resource Owner Grant	44e4f427-7bb6-413b-a887-fff03fedb6fb	basic-flow	t	t
1fd714fe-47ad-4622-a3ef-15fbd2bb4464	Direct Grant - Conditional OTP	Flow to determine if the OTP is required for the authentication	44e4f427-7bb6-413b-a887-fff03fedb6fb	basic-flow	f	t
9350a0ab-309b-40ef-8237-4aa7b02183b7	registration	registration flow	44e4f427-7bb6-413b-a887-fff03fedb6fb	basic-flow	t	t
cc2f615d-3f9c-4ae3-a66c-ab7f22c932ad	registration form	registration form	44e4f427-7bb6-413b-a887-fff03fedb6fb	form-flow	f	t
1775b658-b1c3-4d25-bafd-750a712bf0e7	reset credentials	Reset credentials for a user if they forgot their password or something	44e4f427-7bb6-413b-a887-fff03fedb6fb	basic-flow	t	t
e41df889-4a0c-4d76-b0d7-b569711433dc	Reset - Conditional OTP	Flow to determine if the OTP should be reset or not. Set to REQUIRED to force.	44e4f427-7bb6-413b-a887-fff03fedb6fb	basic-flow	f	t
e33ecdd3-53a9-454a-9394-ca502237819f	clients	Base authentication for clients	44e4f427-7bb6-413b-a887-fff03fedb6fb	client-flow	t	t
1ce9cebf-4d68-48fc-a17f-70afb10ac2a7	first broker login	Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account	44e4f427-7bb6-413b-a887-fff03fedb6fb	basic-flow	t	t
3e9c9283-e3b7-4d40-b47d-6c5af4068831	User creation or linking	Flow for the existing/non-existing user alternatives	44e4f427-7bb6-413b-a887-fff03fedb6fb	basic-flow	f	t
d6e196a6-df75-4f0f-9320-922ac4a56b05	Handle Existing Account	Handle what to do if there is existing account with same email/username like authenticated identity provider	44e4f427-7bb6-413b-a887-fff03fedb6fb	basic-flow	f	t
85cb2e3b-bd7f-4b9b-bb28-f273aa358dad	Account verification options	Method with which to verity the existing account	44e4f427-7bb6-413b-a887-fff03fedb6fb	basic-flow	f	t
f6b8397a-fa04-451a-a089-792bf1868b25	Verify Existing Account by Re-authentication	Reauthentication of existing account	44e4f427-7bb6-413b-a887-fff03fedb6fb	basic-flow	f	t
5c46cd00-4860-439f-9a4d-dcd7cccc6b0c	First broker login - Conditional OTP	Flow to determine if the OTP is required for the authentication	44e4f427-7bb6-413b-a887-fff03fedb6fb	basic-flow	f	t
6513e3a6-0253-44fc-bd5f-81c4d1c4fa14	saml ecp	SAML ECP Profile Authentication Flow	44e4f427-7bb6-413b-a887-fff03fedb6fb	basic-flow	t	t
32554854-cb8b-4602-9d7c-c1bf712bc2d3	docker auth	Used by Docker clients to authenticate against the IDP	44e4f427-7bb6-413b-a887-fff03fedb6fb	basic-flow	t	t
\.


--
-- Data for Name: authenticator_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.authenticator_config (id, alias, realm_id) FROM stdin;
313de56f-94bc-414f-a07b-8dcf9863d112	review profile config	767d9b8d-d1e0-46e8-8336-872e7ee443dd
4f14fbda-df74-4e0b-bb3c-2a5c1453e19e	create unique user config	767d9b8d-d1e0-46e8-8336-872e7ee443dd
45d8ab35-66f3-4136-8b1c-2f032ca0d53a	review profile config	44e4f427-7bb6-413b-a887-fff03fedb6fb
80136f9a-9714-4365-ac2b-f0b234bfe185	create unique user config	44e4f427-7bb6-413b-a887-fff03fedb6fb
\.


--
-- Data for Name: authenticator_config_entry; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.authenticator_config_entry (authenticator_id, value, name) FROM stdin;
313de56f-94bc-414f-a07b-8dcf9863d112	missing	update.profile.on.first.login
4f14fbda-df74-4e0b-bb3c-2a5c1453e19e	false	require.password.update.after.registration
45d8ab35-66f3-4136-8b1c-2f032ca0d53a	missing	update.profile.on.first.login
80136f9a-9714-4365-ac2b-f0b234bfe185	false	require.password.update.after.registration
\.


--
-- Data for Name: broker_link; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.broker_link (identity_provider, storage_provider_id, realm_id, broker_user_id, broker_username, token, user_id) FROM stdin;
\.


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client (id, enabled, full_scope_allowed, client_id, not_before, public_client, secret, base_url, bearer_only, management_url, surrogate_auth_required, realm_id, protocol, node_rereg_timeout, frontchannel_logout, consent_required, name, service_accounts_enabled, client_authenticator_type, root_url, description, registration_token, standard_flow_enabled, implicit_flow_enabled, direct_access_grants_enabled, always_display_in_console) FROM stdin;
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	f	master-realm	0	f	\N	\N	t	\N	f	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N	0	f	f	master Realm	f	client-secret	\N	\N	\N	t	f	f	f
a1142b95-e1b3-4555-8c77-795b329fd5f8	t	f	account	0	t	\N	/realms/master/account/	f	\N	f	767d9b8d-d1e0-46e8-8336-872e7ee443dd	openid-connect	0	f	f	${client_account}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
21f5e158-9ae0-47eb-a8af-5e5413d0f224	t	f	account-console	0	t	\N	/realms/master/account/	f	\N	f	767d9b8d-d1e0-46e8-8336-872e7ee443dd	openid-connect	0	f	f	${client_account-console}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
cf8c636a-969c-4676-a664-99f5bcef27c3	t	f	broker	0	f	\N	\N	t	\N	f	767d9b8d-d1e0-46e8-8336-872e7ee443dd	openid-connect	0	f	f	${client_broker}	f	client-secret	\N	\N	\N	t	f	f	f
fec6b05c-1521-42c8-b5eb-e83a00d28125	t	f	security-admin-console	0	t	\N	/admin/master/console/	f	\N	f	767d9b8d-d1e0-46e8-8336-872e7ee443dd	openid-connect	0	f	f	${client_security-admin-console}	f	client-secret	${authAdminUrl}	\N	\N	t	f	f	f
d1cc947f-0a2f-4975-81a4-877433a52648	t	f	admin-cli	0	t	\N	\N	f	\N	f	767d9b8d-d1e0-46e8-8336-872e7ee443dd	openid-connect	0	f	f	${client_admin-cli}	f	client-secret	\N	\N	\N	f	f	t	f
e000e9f7-279c-4b44-9292-350a83cf8059	t	f	measuremanager-realm	0	f	\N	\N	t	\N	f	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N	0	f	f	measuremanager Realm	f	client-secret	\N	\N	\N	t	f	f	f
e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	f	realm-management	0	f	\N	\N	t	\N	f	44e4f427-7bb6-413b-a887-fff03fedb6fb	openid-connect	0	f	f	${client_realm-management}	f	client-secret	\N	\N	\N	t	f	f	f
79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	t	f	account	0	t	\N	/realms/measuremanager/account/	f	\N	f	44e4f427-7bb6-413b-a887-fff03fedb6fb	openid-connect	0	f	f	${client_account}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
da4d4a95-8670-4686-9786-f6b581ed61ba	t	f	account-console	0	t	\N	/realms/measuremanager/account/	f	\N	f	44e4f427-7bb6-413b-a887-fff03fedb6fb	openid-connect	0	f	f	${client_account-console}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
3acaef89-0228-40fc-abf9-d0c662da3427	t	f	broker	0	f	\N	\N	t	\N	f	44e4f427-7bb6-413b-a887-fff03fedb6fb	openid-connect	0	f	f	${client_broker}	f	client-secret	\N	\N	\N	t	f	f	f
b593bc14-7f70-4926-824b-644aa02f48f8	t	f	security-admin-console	0	t	\N	/admin/measuremanager/console/	f	\N	f	44e4f427-7bb6-413b-a887-fff03fedb6fb	openid-connect	0	f	f	${client_security-admin-console}	f	client-secret	${authAdminUrl}	\N	\N	t	f	f	f
e1f94005-339c-4a55-841f-b2a461b90180	t	f	admin-cli	0	t	\N	\N	f	\N	f	44e4f427-7bb6-413b-a887-fff03fedb6fb	openid-connect	0	f	f	${client_admin-cli}	f	client-secret	\N	\N	\N	f	f	t	f
\.


--
-- Data for Name: client_attributes; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_attributes (client_id, name, value) FROM stdin;
a1142b95-e1b3-4555-8c77-795b329fd5f8	post.logout.redirect.uris	+
21f5e158-9ae0-47eb-a8af-5e5413d0f224	post.logout.redirect.uris	+
21f5e158-9ae0-47eb-a8af-5e5413d0f224	pkce.code.challenge.method	S256
fec6b05c-1521-42c8-b5eb-e83a00d28125	post.logout.redirect.uris	+
fec6b05c-1521-42c8-b5eb-e83a00d28125	pkce.code.challenge.method	S256
79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	post.logout.redirect.uris	+
da4d4a95-8670-4686-9786-f6b581ed61ba	post.logout.redirect.uris	+
da4d4a95-8670-4686-9786-f6b581ed61ba	pkce.code.challenge.method	S256
b593bc14-7f70-4926-824b-644aa02f48f8	post.logout.redirect.uris	+
b593bc14-7f70-4926-824b-644aa02f48f8	pkce.code.challenge.method	S256
\.


--
-- Data for Name: client_auth_flow_bindings; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_auth_flow_bindings (client_id, flow_id, binding_name) FROM stdin;
\.


--
-- Data for Name: client_initial_access; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_initial_access (id, realm_id, "timestamp", expiration, count, remaining_count) FROM stdin;
\.


--
-- Data for Name: client_node_registrations; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_node_registrations (client_id, value, name) FROM stdin;
\.


--
-- Data for Name: client_scope; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_scope (id, name, realm_id, description, protocol) FROM stdin;
d699ef80-95f8-4619-a866-8a1af6f7ec64	offline_access	767d9b8d-d1e0-46e8-8336-872e7ee443dd	OpenID Connect built-in scope: offline_access	openid-connect
a7c717f5-275c-4276-beef-8bb8e0322ad2	role_list	767d9b8d-d1e0-46e8-8336-872e7ee443dd	SAML role list	saml
c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	profile	767d9b8d-d1e0-46e8-8336-872e7ee443dd	OpenID Connect built-in scope: profile	openid-connect
5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	email	767d9b8d-d1e0-46e8-8336-872e7ee443dd	OpenID Connect built-in scope: email	openid-connect
9fc9c2dc-e827-4104-a13f-3d2c84191815	address	767d9b8d-d1e0-46e8-8336-872e7ee443dd	OpenID Connect built-in scope: address	openid-connect
865ea21d-5993-4a7f-ad32-27db092d5270	phone	767d9b8d-d1e0-46e8-8336-872e7ee443dd	OpenID Connect built-in scope: phone	openid-connect
460b8e49-93f3-40a9-b2b9-974a31ef9adf	roles	767d9b8d-d1e0-46e8-8336-872e7ee443dd	OpenID Connect scope for add user roles to the access token	openid-connect
9bf3ba39-3566-4bd5-b772-0214d0d50487	web-origins	767d9b8d-d1e0-46e8-8336-872e7ee443dd	OpenID Connect scope for add allowed web origins to the access token	openid-connect
09bb941f-dcd2-4bad-8bb8-33e32d7c2405	microprofile-jwt	767d9b8d-d1e0-46e8-8336-872e7ee443dd	Microprofile - JWT built-in scope	openid-connect
2d9c822f-439e-43e3-acf4-feb12d41f606	acr	767d9b8d-d1e0-46e8-8336-872e7ee443dd	OpenID Connect scope for add acr (authentication context class reference) to the token	openid-connect
5c424a01-bc01-4622-ba8d-98f7e49e9abe	offline_access	44e4f427-7bb6-413b-a887-fff03fedb6fb	OpenID Connect built-in scope: offline_access	openid-connect
bb85d268-4c5c-42cc-8c30-e74aab503dc3	role_list	44e4f427-7bb6-413b-a887-fff03fedb6fb	SAML role list	saml
56b7f4f2-31cd-41d3-9a4a-449211e08bdd	profile	44e4f427-7bb6-413b-a887-fff03fedb6fb	OpenID Connect built-in scope: profile	openid-connect
569ebbed-a4f4-4171-9ed1-55ff385ee9e6	email	44e4f427-7bb6-413b-a887-fff03fedb6fb	OpenID Connect built-in scope: email	openid-connect
0ce56349-3652-41a7-8d34-f29522d85dc6	address	44e4f427-7bb6-413b-a887-fff03fedb6fb	OpenID Connect built-in scope: address	openid-connect
75b7693b-3901-4fda-8a48-6a116612dab4	phone	44e4f427-7bb6-413b-a887-fff03fedb6fb	OpenID Connect built-in scope: phone	openid-connect
deddb0fa-5233-4c6f-b07d-a2d7985f40c3	roles	44e4f427-7bb6-413b-a887-fff03fedb6fb	OpenID Connect scope for add user roles to the access token	openid-connect
26b3ff50-189f-4569-ae85-07e3bd6b4da5	web-origins	44e4f427-7bb6-413b-a887-fff03fedb6fb	OpenID Connect scope for add allowed web origins to the access token	openid-connect
681d3e9c-bf34-4475-8fee-5693e3cb2409	microprofile-jwt	44e4f427-7bb6-413b-a887-fff03fedb6fb	Microprofile - JWT built-in scope	openid-connect
c8c45953-cf67-44e6-a79a-7dfebd00b2fe	acr	44e4f427-7bb6-413b-a887-fff03fedb6fb	OpenID Connect scope for add acr (authentication context class reference) to the token	openid-connect
\.


--
-- Data for Name: client_scope_attributes; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_scope_attributes (scope_id, value, name) FROM stdin;
d699ef80-95f8-4619-a866-8a1af6f7ec64	true	display.on.consent.screen
d699ef80-95f8-4619-a866-8a1af6f7ec64	${offlineAccessScopeConsentText}	consent.screen.text
a7c717f5-275c-4276-beef-8bb8e0322ad2	true	display.on.consent.screen
a7c717f5-275c-4276-beef-8bb8e0322ad2	${samlRoleListScopeConsentText}	consent.screen.text
c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	true	display.on.consent.screen
c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	${profileScopeConsentText}	consent.screen.text
c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	true	include.in.token.scope
5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	true	display.on.consent.screen
5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	${emailScopeConsentText}	consent.screen.text
5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	true	include.in.token.scope
9fc9c2dc-e827-4104-a13f-3d2c84191815	true	display.on.consent.screen
9fc9c2dc-e827-4104-a13f-3d2c84191815	${addressScopeConsentText}	consent.screen.text
9fc9c2dc-e827-4104-a13f-3d2c84191815	true	include.in.token.scope
865ea21d-5993-4a7f-ad32-27db092d5270	true	display.on.consent.screen
865ea21d-5993-4a7f-ad32-27db092d5270	${phoneScopeConsentText}	consent.screen.text
865ea21d-5993-4a7f-ad32-27db092d5270	true	include.in.token.scope
460b8e49-93f3-40a9-b2b9-974a31ef9adf	true	display.on.consent.screen
460b8e49-93f3-40a9-b2b9-974a31ef9adf	${rolesScopeConsentText}	consent.screen.text
460b8e49-93f3-40a9-b2b9-974a31ef9adf	false	include.in.token.scope
9bf3ba39-3566-4bd5-b772-0214d0d50487	false	display.on.consent.screen
9bf3ba39-3566-4bd5-b772-0214d0d50487		consent.screen.text
9bf3ba39-3566-4bd5-b772-0214d0d50487	false	include.in.token.scope
09bb941f-dcd2-4bad-8bb8-33e32d7c2405	false	display.on.consent.screen
09bb941f-dcd2-4bad-8bb8-33e32d7c2405	true	include.in.token.scope
2d9c822f-439e-43e3-acf4-feb12d41f606	false	display.on.consent.screen
2d9c822f-439e-43e3-acf4-feb12d41f606	false	include.in.token.scope
5c424a01-bc01-4622-ba8d-98f7e49e9abe	true	display.on.consent.screen
5c424a01-bc01-4622-ba8d-98f7e49e9abe	${offlineAccessScopeConsentText}	consent.screen.text
bb85d268-4c5c-42cc-8c30-e74aab503dc3	true	display.on.consent.screen
bb85d268-4c5c-42cc-8c30-e74aab503dc3	${samlRoleListScopeConsentText}	consent.screen.text
56b7f4f2-31cd-41d3-9a4a-449211e08bdd	true	display.on.consent.screen
56b7f4f2-31cd-41d3-9a4a-449211e08bdd	${profileScopeConsentText}	consent.screen.text
56b7f4f2-31cd-41d3-9a4a-449211e08bdd	true	include.in.token.scope
569ebbed-a4f4-4171-9ed1-55ff385ee9e6	true	display.on.consent.screen
569ebbed-a4f4-4171-9ed1-55ff385ee9e6	${emailScopeConsentText}	consent.screen.text
569ebbed-a4f4-4171-9ed1-55ff385ee9e6	true	include.in.token.scope
0ce56349-3652-41a7-8d34-f29522d85dc6	true	display.on.consent.screen
0ce56349-3652-41a7-8d34-f29522d85dc6	${addressScopeConsentText}	consent.screen.text
0ce56349-3652-41a7-8d34-f29522d85dc6	true	include.in.token.scope
75b7693b-3901-4fda-8a48-6a116612dab4	true	display.on.consent.screen
75b7693b-3901-4fda-8a48-6a116612dab4	${phoneScopeConsentText}	consent.screen.text
75b7693b-3901-4fda-8a48-6a116612dab4	true	include.in.token.scope
deddb0fa-5233-4c6f-b07d-a2d7985f40c3	true	display.on.consent.screen
deddb0fa-5233-4c6f-b07d-a2d7985f40c3	${rolesScopeConsentText}	consent.screen.text
deddb0fa-5233-4c6f-b07d-a2d7985f40c3	false	include.in.token.scope
26b3ff50-189f-4569-ae85-07e3bd6b4da5	false	display.on.consent.screen
26b3ff50-189f-4569-ae85-07e3bd6b4da5		consent.screen.text
26b3ff50-189f-4569-ae85-07e3bd6b4da5	false	include.in.token.scope
681d3e9c-bf34-4475-8fee-5693e3cb2409	false	display.on.consent.screen
681d3e9c-bf34-4475-8fee-5693e3cb2409	true	include.in.token.scope
c8c45953-cf67-44e6-a79a-7dfebd00b2fe	false	display.on.consent.screen
c8c45953-cf67-44e6-a79a-7dfebd00b2fe	false	include.in.token.scope
\.


--
-- Data for Name: client_scope_client; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_scope_client (client_id, scope_id, default_scope) FROM stdin;
a1142b95-e1b3-4555-8c77-795b329fd5f8	2d9c822f-439e-43e3-acf4-feb12d41f606	t
a1142b95-e1b3-4555-8c77-795b329fd5f8	5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	t
a1142b95-e1b3-4555-8c77-795b329fd5f8	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	t
a1142b95-e1b3-4555-8c77-795b329fd5f8	9bf3ba39-3566-4bd5-b772-0214d0d50487	t
a1142b95-e1b3-4555-8c77-795b329fd5f8	460b8e49-93f3-40a9-b2b9-974a31ef9adf	t
a1142b95-e1b3-4555-8c77-795b329fd5f8	09bb941f-dcd2-4bad-8bb8-33e32d7c2405	f
a1142b95-e1b3-4555-8c77-795b329fd5f8	865ea21d-5993-4a7f-ad32-27db092d5270	f
a1142b95-e1b3-4555-8c77-795b329fd5f8	9fc9c2dc-e827-4104-a13f-3d2c84191815	f
a1142b95-e1b3-4555-8c77-795b329fd5f8	d699ef80-95f8-4619-a866-8a1af6f7ec64	f
21f5e158-9ae0-47eb-a8af-5e5413d0f224	2d9c822f-439e-43e3-acf4-feb12d41f606	t
21f5e158-9ae0-47eb-a8af-5e5413d0f224	5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	t
21f5e158-9ae0-47eb-a8af-5e5413d0f224	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	t
21f5e158-9ae0-47eb-a8af-5e5413d0f224	9bf3ba39-3566-4bd5-b772-0214d0d50487	t
21f5e158-9ae0-47eb-a8af-5e5413d0f224	460b8e49-93f3-40a9-b2b9-974a31ef9adf	t
21f5e158-9ae0-47eb-a8af-5e5413d0f224	09bb941f-dcd2-4bad-8bb8-33e32d7c2405	f
21f5e158-9ae0-47eb-a8af-5e5413d0f224	865ea21d-5993-4a7f-ad32-27db092d5270	f
21f5e158-9ae0-47eb-a8af-5e5413d0f224	9fc9c2dc-e827-4104-a13f-3d2c84191815	f
21f5e158-9ae0-47eb-a8af-5e5413d0f224	d699ef80-95f8-4619-a866-8a1af6f7ec64	f
d1cc947f-0a2f-4975-81a4-877433a52648	2d9c822f-439e-43e3-acf4-feb12d41f606	t
d1cc947f-0a2f-4975-81a4-877433a52648	5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	t
d1cc947f-0a2f-4975-81a4-877433a52648	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	t
d1cc947f-0a2f-4975-81a4-877433a52648	9bf3ba39-3566-4bd5-b772-0214d0d50487	t
d1cc947f-0a2f-4975-81a4-877433a52648	460b8e49-93f3-40a9-b2b9-974a31ef9adf	t
d1cc947f-0a2f-4975-81a4-877433a52648	09bb941f-dcd2-4bad-8bb8-33e32d7c2405	f
d1cc947f-0a2f-4975-81a4-877433a52648	865ea21d-5993-4a7f-ad32-27db092d5270	f
d1cc947f-0a2f-4975-81a4-877433a52648	9fc9c2dc-e827-4104-a13f-3d2c84191815	f
d1cc947f-0a2f-4975-81a4-877433a52648	d699ef80-95f8-4619-a866-8a1af6f7ec64	f
cf8c636a-969c-4676-a664-99f5bcef27c3	2d9c822f-439e-43e3-acf4-feb12d41f606	t
cf8c636a-969c-4676-a664-99f5bcef27c3	5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	t
cf8c636a-969c-4676-a664-99f5bcef27c3	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	t
cf8c636a-969c-4676-a664-99f5bcef27c3	9bf3ba39-3566-4bd5-b772-0214d0d50487	t
cf8c636a-969c-4676-a664-99f5bcef27c3	460b8e49-93f3-40a9-b2b9-974a31ef9adf	t
cf8c636a-969c-4676-a664-99f5bcef27c3	09bb941f-dcd2-4bad-8bb8-33e32d7c2405	f
cf8c636a-969c-4676-a664-99f5bcef27c3	865ea21d-5993-4a7f-ad32-27db092d5270	f
cf8c636a-969c-4676-a664-99f5bcef27c3	9fc9c2dc-e827-4104-a13f-3d2c84191815	f
cf8c636a-969c-4676-a664-99f5bcef27c3	d699ef80-95f8-4619-a866-8a1af6f7ec64	f
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	2d9c822f-439e-43e3-acf4-feb12d41f606	t
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	t
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	t
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	9bf3ba39-3566-4bd5-b772-0214d0d50487	t
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	460b8e49-93f3-40a9-b2b9-974a31ef9adf	t
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	09bb941f-dcd2-4bad-8bb8-33e32d7c2405	f
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	865ea21d-5993-4a7f-ad32-27db092d5270	f
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	9fc9c2dc-e827-4104-a13f-3d2c84191815	f
da9bd4e7-bea8-45c2-8d22-acd2f2caba75	d699ef80-95f8-4619-a866-8a1af6f7ec64	f
fec6b05c-1521-42c8-b5eb-e83a00d28125	2d9c822f-439e-43e3-acf4-feb12d41f606	t
fec6b05c-1521-42c8-b5eb-e83a00d28125	5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	t
fec6b05c-1521-42c8-b5eb-e83a00d28125	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	t
fec6b05c-1521-42c8-b5eb-e83a00d28125	9bf3ba39-3566-4bd5-b772-0214d0d50487	t
fec6b05c-1521-42c8-b5eb-e83a00d28125	460b8e49-93f3-40a9-b2b9-974a31ef9adf	t
fec6b05c-1521-42c8-b5eb-e83a00d28125	09bb941f-dcd2-4bad-8bb8-33e32d7c2405	f
fec6b05c-1521-42c8-b5eb-e83a00d28125	865ea21d-5993-4a7f-ad32-27db092d5270	f
fec6b05c-1521-42c8-b5eb-e83a00d28125	9fc9c2dc-e827-4104-a13f-3d2c84191815	f
fec6b05c-1521-42c8-b5eb-e83a00d28125	d699ef80-95f8-4619-a866-8a1af6f7ec64	f
79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	569ebbed-a4f4-4171-9ed1-55ff385ee9e6	t
79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	deddb0fa-5233-4c6f-b07d-a2d7985f40c3	t
79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	56b7f4f2-31cd-41d3-9a4a-449211e08bdd	t
79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	26b3ff50-189f-4569-ae85-07e3bd6b4da5	t
79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	c8c45953-cf67-44e6-a79a-7dfebd00b2fe	t
79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	0ce56349-3652-41a7-8d34-f29522d85dc6	f
79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	75b7693b-3901-4fda-8a48-6a116612dab4	f
79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	5c424a01-bc01-4622-ba8d-98f7e49e9abe	f
79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	681d3e9c-bf34-4475-8fee-5693e3cb2409	f
da4d4a95-8670-4686-9786-f6b581ed61ba	569ebbed-a4f4-4171-9ed1-55ff385ee9e6	t
da4d4a95-8670-4686-9786-f6b581ed61ba	deddb0fa-5233-4c6f-b07d-a2d7985f40c3	t
da4d4a95-8670-4686-9786-f6b581ed61ba	56b7f4f2-31cd-41d3-9a4a-449211e08bdd	t
da4d4a95-8670-4686-9786-f6b581ed61ba	26b3ff50-189f-4569-ae85-07e3bd6b4da5	t
da4d4a95-8670-4686-9786-f6b581ed61ba	c8c45953-cf67-44e6-a79a-7dfebd00b2fe	t
da4d4a95-8670-4686-9786-f6b581ed61ba	0ce56349-3652-41a7-8d34-f29522d85dc6	f
da4d4a95-8670-4686-9786-f6b581ed61ba	75b7693b-3901-4fda-8a48-6a116612dab4	f
da4d4a95-8670-4686-9786-f6b581ed61ba	5c424a01-bc01-4622-ba8d-98f7e49e9abe	f
da4d4a95-8670-4686-9786-f6b581ed61ba	681d3e9c-bf34-4475-8fee-5693e3cb2409	f
e1f94005-339c-4a55-841f-b2a461b90180	569ebbed-a4f4-4171-9ed1-55ff385ee9e6	t
e1f94005-339c-4a55-841f-b2a461b90180	deddb0fa-5233-4c6f-b07d-a2d7985f40c3	t
e1f94005-339c-4a55-841f-b2a461b90180	56b7f4f2-31cd-41d3-9a4a-449211e08bdd	t
e1f94005-339c-4a55-841f-b2a461b90180	26b3ff50-189f-4569-ae85-07e3bd6b4da5	t
e1f94005-339c-4a55-841f-b2a461b90180	c8c45953-cf67-44e6-a79a-7dfebd00b2fe	t
e1f94005-339c-4a55-841f-b2a461b90180	0ce56349-3652-41a7-8d34-f29522d85dc6	f
e1f94005-339c-4a55-841f-b2a461b90180	75b7693b-3901-4fda-8a48-6a116612dab4	f
e1f94005-339c-4a55-841f-b2a461b90180	5c424a01-bc01-4622-ba8d-98f7e49e9abe	f
e1f94005-339c-4a55-841f-b2a461b90180	681d3e9c-bf34-4475-8fee-5693e3cb2409	f
3acaef89-0228-40fc-abf9-d0c662da3427	569ebbed-a4f4-4171-9ed1-55ff385ee9e6	t
3acaef89-0228-40fc-abf9-d0c662da3427	deddb0fa-5233-4c6f-b07d-a2d7985f40c3	t
3acaef89-0228-40fc-abf9-d0c662da3427	56b7f4f2-31cd-41d3-9a4a-449211e08bdd	t
3acaef89-0228-40fc-abf9-d0c662da3427	26b3ff50-189f-4569-ae85-07e3bd6b4da5	t
3acaef89-0228-40fc-abf9-d0c662da3427	c8c45953-cf67-44e6-a79a-7dfebd00b2fe	t
3acaef89-0228-40fc-abf9-d0c662da3427	0ce56349-3652-41a7-8d34-f29522d85dc6	f
3acaef89-0228-40fc-abf9-d0c662da3427	75b7693b-3901-4fda-8a48-6a116612dab4	f
3acaef89-0228-40fc-abf9-d0c662da3427	5c424a01-bc01-4622-ba8d-98f7e49e9abe	f
3acaef89-0228-40fc-abf9-d0c662da3427	681d3e9c-bf34-4475-8fee-5693e3cb2409	f
e37f7a82-6d4f-4c47-9304-87eaf696d4c2	569ebbed-a4f4-4171-9ed1-55ff385ee9e6	t
e37f7a82-6d4f-4c47-9304-87eaf696d4c2	deddb0fa-5233-4c6f-b07d-a2d7985f40c3	t
e37f7a82-6d4f-4c47-9304-87eaf696d4c2	56b7f4f2-31cd-41d3-9a4a-449211e08bdd	t
e37f7a82-6d4f-4c47-9304-87eaf696d4c2	26b3ff50-189f-4569-ae85-07e3bd6b4da5	t
e37f7a82-6d4f-4c47-9304-87eaf696d4c2	c8c45953-cf67-44e6-a79a-7dfebd00b2fe	t
e37f7a82-6d4f-4c47-9304-87eaf696d4c2	0ce56349-3652-41a7-8d34-f29522d85dc6	f
e37f7a82-6d4f-4c47-9304-87eaf696d4c2	75b7693b-3901-4fda-8a48-6a116612dab4	f
e37f7a82-6d4f-4c47-9304-87eaf696d4c2	5c424a01-bc01-4622-ba8d-98f7e49e9abe	f
e37f7a82-6d4f-4c47-9304-87eaf696d4c2	681d3e9c-bf34-4475-8fee-5693e3cb2409	f
b593bc14-7f70-4926-824b-644aa02f48f8	569ebbed-a4f4-4171-9ed1-55ff385ee9e6	t
b593bc14-7f70-4926-824b-644aa02f48f8	deddb0fa-5233-4c6f-b07d-a2d7985f40c3	t
b593bc14-7f70-4926-824b-644aa02f48f8	56b7f4f2-31cd-41d3-9a4a-449211e08bdd	t
b593bc14-7f70-4926-824b-644aa02f48f8	26b3ff50-189f-4569-ae85-07e3bd6b4da5	t
b593bc14-7f70-4926-824b-644aa02f48f8	c8c45953-cf67-44e6-a79a-7dfebd00b2fe	t
b593bc14-7f70-4926-824b-644aa02f48f8	0ce56349-3652-41a7-8d34-f29522d85dc6	f
b593bc14-7f70-4926-824b-644aa02f48f8	75b7693b-3901-4fda-8a48-6a116612dab4	f
b593bc14-7f70-4926-824b-644aa02f48f8	5c424a01-bc01-4622-ba8d-98f7e49e9abe	f
b593bc14-7f70-4926-824b-644aa02f48f8	681d3e9c-bf34-4475-8fee-5693e3cb2409	f
\.


--
-- Data for Name: client_scope_role_mapping; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_scope_role_mapping (scope_id, role_id) FROM stdin;
d699ef80-95f8-4619-a866-8a1af6f7ec64	55cab3c6-7f3a-40f6-a08e-26b93a97e44c
5c424a01-bc01-4622-ba8d-98f7e49e9abe	ede82158-5112-476f-afad-c8a8b58d24b2
\.


--
-- Data for Name: client_session; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_session (id, client_id, redirect_uri, state, "timestamp", session_id, auth_method, realm_id, auth_user_id, current_action) FROM stdin;
\.


--
-- Data for Name: client_session_auth_status; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_session_auth_status (authenticator, status, client_session) FROM stdin;
\.


--
-- Data for Name: client_session_note; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_session_note (name, value, client_session) FROM stdin;
\.


--
-- Data for Name: client_session_prot_mapper; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_session_prot_mapper (protocol_mapper_id, client_session) FROM stdin;
\.


--
-- Data for Name: client_session_role; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_session_role (role_id, client_session) FROM stdin;
\.


--
-- Data for Name: client_user_session_note; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.client_user_session_note (name, value, client_session) FROM stdin;
\.


--
-- Data for Name: component; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.component (id, name, parent_id, provider_id, provider_type, realm_id, sub_type) FROM stdin;
c6750b2e-2953-4c9d-8df2-fef810568478	Trusted Hosts	767d9b8d-d1e0-46e8-8336-872e7ee443dd	trusted-hosts	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	anonymous
2932cdb7-bb3d-4ea8-855f-0005e4f2a005	Consent Required	767d9b8d-d1e0-46e8-8336-872e7ee443dd	consent-required	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	anonymous
355a7915-968a-4b22-81fb-5b220eaf4d2c	Full Scope Disabled	767d9b8d-d1e0-46e8-8336-872e7ee443dd	scope	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	anonymous
47b38b4f-8c74-4bcc-bfb9-a3314fab53ce	Max Clients Limit	767d9b8d-d1e0-46e8-8336-872e7ee443dd	max-clients	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	anonymous
3ed1d2ce-b4bc-4d55-ba35-6be52fdf7b92	Allowed Protocol Mapper Types	767d9b8d-d1e0-46e8-8336-872e7ee443dd	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	anonymous
0d9eedf9-0729-47a6-afd2-c87ecc044c13	Allowed Client Scopes	767d9b8d-d1e0-46e8-8336-872e7ee443dd	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	anonymous
de957ca1-7466-40d6-be17-9547a322f7e5	Allowed Protocol Mapper Types	767d9b8d-d1e0-46e8-8336-872e7ee443dd	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	authenticated
a739f054-6916-4a0f-ba16-0721530d5bc5	Allowed Client Scopes	767d9b8d-d1e0-46e8-8336-872e7ee443dd	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	authenticated
c6141c5a-a4e0-4eb3-9ac7-7f2dfbe9b698	rsa-generated	767d9b8d-d1e0-46e8-8336-872e7ee443dd	rsa-generated	org.keycloak.keys.KeyProvider	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N
3767d4cd-4b30-4fd4-8494-69d83c2cfa1d	rsa-enc-generated	767d9b8d-d1e0-46e8-8336-872e7ee443dd	rsa-enc-generated	org.keycloak.keys.KeyProvider	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N
50642073-02d2-43ea-a018-5313e073db8b	hmac-generated-hs512	767d9b8d-d1e0-46e8-8336-872e7ee443dd	hmac-generated	org.keycloak.keys.KeyProvider	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N
b06fa115-261e-4ae8-86ee-332cd7c6b11c	aes-generated	767d9b8d-d1e0-46e8-8336-872e7ee443dd	aes-generated	org.keycloak.keys.KeyProvider	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N
f8d9e231-643b-4009-ac4b-567173041645	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	declarative-user-profile	org.keycloak.userprofile.UserProfileProvider	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N
afbb8b33-44fd-4b67-8bec-f3b64775feb2	rsa-generated	44e4f427-7bb6-413b-a887-fff03fedb6fb	rsa-generated	org.keycloak.keys.KeyProvider	44e4f427-7bb6-413b-a887-fff03fedb6fb	\N
b2526def-aa85-420b-9039-f84224b7af18	rsa-enc-generated	44e4f427-7bb6-413b-a887-fff03fedb6fb	rsa-enc-generated	org.keycloak.keys.KeyProvider	44e4f427-7bb6-413b-a887-fff03fedb6fb	\N
a4d5dd10-cea7-42f3-a962-64ca2f6125e8	hmac-generated-hs512	44e4f427-7bb6-413b-a887-fff03fedb6fb	hmac-generated	org.keycloak.keys.KeyProvider	44e4f427-7bb6-413b-a887-fff03fedb6fb	\N
e2808e3c-2add-4a05-b807-92735746fd59	aes-generated	44e4f427-7bb6-413b-a887-fff03fedb6fb	aes-generated	org.keycloak.keys.KeyProvider	44e4f427-7bb6-413b-a887-fff03fedb6fb	\N
80e7cdeb-b028-42ff-847f-a1eab55829ac	Trusted Hosts	44e4f427-7bb6-413b-a887-fff03fedb6fb	trusted-hosts	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	44e4f427-7bb6-413b-a887-fff03fedb6fb	anonymous
7ebf2dfe-f9a2-465f-88be-6109e1a0a66d	Consent Required	44e4f427-7bb6-413b-a887-fff03fedb6fb	consent-required	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	44e4f427-7bb6-413b-a887-fff03fedb6fb	anonymous
fb8b9f0e-b28d-4a4e-b60d-b347edf8224d	Full Scope Disabled	44e4f427-7bb6-413b-a887-fff03fedb6fb	scope	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	44e4f427-7bb6-413b-a887-fff03fedb6fb	anonymous
09a4616b-41f3-4ea4-9d87-291723501565	Max Clients Limit	44e4f427-7bb6-413b-a887-fff03fedb6fb	max-clients	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	44e4f427-7bb6-413b-a887-fff03fedb6fb	anonymous
4f30309d-2dee-4800-bd82-30e28c6c00f3	Allowed Protocol Mapper Types	44e4f427-7bb6-413b-a887-fff03fedb6fb	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	44e4f427-7bb6-413b-a887-fff03fedb6fb	anonymous
99aeb48e-ec34-4b1e-8c01-35889e31e688	Allowed Client Scopes	44e4f427-7bb6-413b-a887-fff03fedb6fb	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	44e4f427-7bb6-413b-a887-fff03fedb6fb	anonymous
b8037297-592e-4cb2-9dff-9d4ae440c29a	Allowed Protocol Mapper Types	44e4f427-7bb6-413b-a887-fff03fedb6fb	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	44e4f427-7bb6-413b-a887-fff03fedb6fb	authenticated
d94be5f4-d1c0-4f48-9703-87726ac2f7e4	Allowed Client Scopes	44e4f427-7bb6-413b-a887-fff03fedb6fb	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	44e4f427-7bb6-413b-a887-fff03fedb6fb	authenticated
\.


--
-- Data for Name: component_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.component_config (id, component_id, name, value) FROM stdin;
042bc7f2-02e8-4484-a415-948d4a72d9a2	47b38b4f-8c74-4bcc-bfb9-a3314fab53ce	max-clients	200
9b93a031-bb2b-4016-a6e6-8ef4e407f361	de957ca1-7466-40d6-be17-9547a322f7e5	allowed-protocol-mapper-types	saml-user-property-mapper
d0366776-fad3-49b1-b04d-850e8b1955a1	de957ca1-7466-40d6-be17-9547a322f7e5	allowed-protocol-mapper-types	saml-user-attribute-mapper
aad70621-92ed-473f-9653-640a07c03e02	de957ca1-7466-40d6-be17-9547a322f7e5	allowed-protocol-mapper-types	saml-role-list-mapper
d51df27f-1603-4ed7-95ab-2a09a1ce3c13	de957ca1-7466-40d6-be17-9547a322f7e5	allowed-protocol-mapper-types	oidc-full-name-mapper
2bcfce92-6445-4943-ba0c-9a2e45ceebe1	de957ca1-7466-40d6-be17-9547a322f7e5	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
f50a96d4-3beb-4566-adf8-75de7bb442a2	de957ca1-7466-40d6-be17-9547a322f7e5	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
51db98e3-d187-4250-8d6e-6af239b681d7	de957ca1-7466-40d6-be17-9547a322f7e5	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
a7f70a9a-1dfa-4491-b157-e50e595ccb1c	de957ca1-7466-40d6-be17-9547a322f7e5	allowed-protocol-mapper-types	oidc-address-mapper
6b745bc3-9790-4990-a7ee-b50f6730fa81	c6750b2e-2953-4c9d-8df2-fef810568478	client-uris-must-match	true
adfbc05e-11e7-49ac-8db9-259bb28a0419	c6750b2e-2953-4c9d-8df2-fef810568478	host-sending-registration-request-must-match	true
92cdca24-089e-4bc3-b731-0c44f86c7d4c	0d9eedf9-0729-47a6-afd2-c87ecc044c13	allow-default-scopes	true
cda462eb-5d8f-4436-a3c9-929edfef2089	a739f054-6916-4a0f-ba16-0721530d5bc5	allow-default-scopes	true
aa35b148-a84d-4f0a-b19f-88aa436ae637	3ed1d2ce-b4bc-4d55-ba35-6be52fdf7b92	allowed-protocol-mapper-types	oidc-full-name-mapper
abb580c3-0db6-4838-8eec-bf0123555e12	3ed1d2ce-b4bc-4d55-ba35-6be52fdf7b92	allowed-protocol-mapper-types	saml-role-list-mapper
14390cd3-92f7-45c9-a224-593517bb44d2	3ed1d2ce-b4bc-4d55-ba35-6be52fdf7b92	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
8ae8e370-4de1-4a05-99ff-97b6bc835251	3ed1d2ce-b4bc-4d55-ba35-6be52fdf7b92	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
a597645c-2780-402a-8a9f-7e2e9c78058c	3ed1d2ce-b4bc-4d55-ba35-6be52fdf7b92	allowed-protocol-mapper-types	saml-user-attribute-mapper
c9a0a75c-f3a0-4038-a0b2-075a8d152ebc	3ed1d2ce-b4bc-4d55-ba35-6be52fdf7b92	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
af2da44e-6c6f-4cb1-84ac-8d9ad8b468a7	3ed1d2ce-b4bc-4d55-ba35-6be52fdf7b92	allowed-protocol-mapper-types	saml-user-property-mapper
69febcd4-35ca-42b9-b9d6-1ca1efd2b9e8	3ed1d2ce-b4bc-4d55-ba35-6be52fdf7b92	allowed-protocol-mapper-types	oidc-address-mapper
072d44b0-cf14-4865-8b7a-87bbfef41f26	50642073-02d2-43ea-a018-5313e073db8b	secret	6TJS-bbq1MSrOoGXZPjTAFBgas7XfD3qFGyB3oD-8g51_lr7b4ilfbYsZuLOK_qOPKfizPaBUTA5K6LDOXXM2KYbJC0LgXV69oWLtN03h-al2KWHoxM4KueHUCMVnIiacTQXLbPHhtVVd1DdyBXmY8FTZ70k46npgH6-s_L24Gk
a3cd470d-4f5c-4c62-bca3-526bfe586928	50642073-02d2-43ea-a018-5313e073db8b	algorithm	HS512
e95f443c-37b6-40b7-bf39-5b2ddd1ea2d5	50642073-02d2-43ea-a018-5313e073db8b	kid	7462f5b0-fa48-4bd1-a389-1bee8d6270cd
16d917b5-3dc7-459b-9834-b6923f28ccfd	50642073-02d2-43ea-a018-5313e073db8b	priority	100
a152ba5f-9c59-4c95-8640-9f0e75dd93c5	3767d4cd-4b30-4fd4-8494-69d83c2cfa1d	keyUse	ENC
79b130e7-b02f-4849-989f-bcf3bb311c7e	3767d4cd-4b30-4fd4-8494-69d83c2cfa1d	algorithm	RSA-OAEP
a0ba20aa-5131-44e3-a949-cf4fee62f5c1	3767d4cd-4b30-4fd4-8494-69d83c2cfa1d	privateKey	MIIEogIBAAKCAQEApUEy/I9aufzWS4S4zAERNoOO7KS9JkoP40Rmx1ySw9hPraW/WdePm3XfbOggx/RQzobmA7jxS7biCje81RzZO8ERvjbFTZHKuP+8V5T17+ejZ4648hzjGeIaUfSBQ8qWnu5pMjmOH13d5y+L2HELm4eXiOKfaolowiH2AXOHn5ymbxhevVJrTXJPaosyS1qMwqTG8EfWnukDP1yc6xyvUR/oabhx/GsPrkc6vZ6T30p8/wfvtI7ShNlLDgbg1CETy4jAIIuq5gV7cTCDfz8UbEC/2txTKtarnaGFHXFeKXrfeXP4eD2ALFtTtdzjFEgktUpjQLU1mfeoyoJ2SVZSPQIDAQABAoIBAAe7XjcCP2d2VKch5ZeTRoqQwI4tQwsDP20Nv+qnV9fr9gZqO+K95Y02MvxLJsV+6+JN3iiMbasc5Rnp87Qw7lplCn8mMY295YifBovpKfyjOjpX1irAfpZbxYl8xtOKK16c9F+84PvHY4uJO6Imio7TWvFfpmp7VWMdPapht8BtpjQgRPbF3hKaKc/3BCD6UfQBVfxHJ0VvCuCUcmX5/JcUjVu/Ec3U7Hb0AXNgnLy7T4JxGmBdBQwdpVCfR4GIEOYkWVvnK3nFCRbygXOXiQEzbGAGU/8N6P7Y84jw73pBZKq+C8ouD8nGyvo77yin/wjRy1lDON/Z9PStHPlk3EECgYEA5iU6cdwNsOdeUisc2vQNDxsyI9nydCv/pWmtSdtpLax7Wh14lSf9DQEQA1yXL7wFuaNV96RAZUBASyLlMH+WRK8JUtZZqFWmYbCIvmyFQaMoMTj6hbm3bZ59TnVuJTjZoQwBql91FXgKEvjLutE8Q8S2rDY8DCVq4dk4fyxnFQ0CgYEAt9HFyjqrbjD13xIAGixTLHosbMwLyU/ZOj62c1Xo5BjRRLh4Dy5QCqViX5aC2/8yta/a3XnNIFZEVdw4oxlw63rKN7KfJunwRNx9jC6q229BchkSMhFesDpBQ1PYjaLGWLb3lwSegkLkoOnoNzZmJ4B+4oFW5JJz1JwDyBhbRfECgYBYvYYZnRYSXkQ6PrFzo6LdbkkZFdKtBMIgT+0ni1i06cruZmq2aKLkPsKj6THKkB9NAzQEtuq1n96qmhvxZWDVvwBDVq9ffxcWl/FCK6n+MyEuSaAfrAqUVAZRGGqOI6uWs4B45zHIQ27u/cvgjwlDwDgHkyn4LP1XdGCaeM6OiQKBgB2lnaryL3gEOYOS2aVfBMMlqUia2EPNtxFnz/FmJ7uyLP5Sajq4k3xEFEuqcMyeqkUXactSu7y9bSQT8qaLkeTI1xiInJagIHpavX0AgdoGZZ3LYV3l40m0+5WqTkD5wdfJGsGmoxILS+iQET3mbi9s0AokJimTXU8rIokBNKdhAoGAUUwsMSXevoQ4aq1Hz/CQkOc3wD45N97pWD6IcTLR6x7sJxPbrlQgXFweE1NHgRfGCksx1Ba2OKHjpfsefUyziBTDqCZ1ThV7W9slGwVpNRpz4uZl7yw5qLfZO5abS3PCtoeTkQCbr9bJcjUShRKmhSO/HjgV60qKbcZsTTrcoqY=
65b6ede0-cebc-46ef-93f0-44b544c30c1d	3767d4cd-4b30-4fd4-8494-69d83c2cfa1d	certificate	MIICmzCCAYMCBgGVPMgczjANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjUwMjI1MTEwMzIyWhcNMzUwMjI1MTEwNTAyWjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQClQTL8j1q5/NZLhLjMARE2g47spL0mSg/jRGbHXJLD2E+tpb9Z14+bdd9s6CDH9FDOhuYDuPFLtuIKN7zVHNk7wRG+NsVNkcq4/7xXlPXv56NnjrjyHOMZ4hpR9IFDypae7mkyOY4fXd3nL4vYcQubh5eI4p9qiWjCIfYBc4efnKZvGF69UmtNck9qizJLWozCpMbwR9ae6QM/XJzrHK9RH+hpuHH8aw+uRzq9npPfSnz/B++0jtKE2UsOBuDUIRPLiMAgi6rmBXtxMIN/PxRsQL/a3FMq1qudoYUdcV4pet95c/h4PYAsW1O13OMUSCS1SmNAtTWZ96jKgnZJVlI9AgMBAAEwDQYJKoZIhvcNAQELBQADggEBAJE2hJYSAC5coW2ZFzLeXDl88Z6FN0u+LKTpYp91lm8NBl8fcZQJuS/W8jvQ+Br4Cg5vxQqNH4mFaaETkhzrx/J7QvfUCu+IeuIeW+XehdpqtJx7FxU+nePTve6BFzliK9W7zWK92paxv1TUkwr02sQ24LdhaqQeLntHuAo6SWHTEoIO+ps/litab3AeSWkZ6I7dWn9D0Gt4TZBidj5cChyEHMnVMHW47vFZTZUK88N9M/uBYFTI+bvYfuGodIqpccYz/8HBOAkjE9M3Hc2Wd9rOiS7NW+whf6rVmkHoU3dlzh3W/l1Ug7wXAsfR8eeRCGcveE46omGXwS2cv39OAFk=
b7181471-14c1-4fa3-9e2c-6e640bb1b1b4	3767d4cd-4b30-4fd4-8494-69d83c2cfa1d	priority	100
ded4a11b-7abd-4fdb-b233-be48d995fa65	f8d9e231-643b-4009-ac4b-567173041645	kc.user.profile.config	{"attributes":[{"name":"username","displayName":"${username}","validations":{"length":{"min":3,"max":255},"username-prohibited-characters":{},"up-username-not-idn-homograph":{}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false},{"name":"email","displayName":"${email}","validations":{"email":{},"length":{"max":255}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false},{"name":"firstName","displayName":"${firstName}","validations":{"length":{"max":255},"person-name-prohibited-characters":{}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false},{"name":"lastName","displayName":"${lastName}","validations":{"length":{"max":255},"person-name-prohibited-characters":{}},"permissions":{"view":["admin","user"],"edit":["admin","user"]},"multivalued":false}],"groups":[{"name":"user-metadata","displayHeader":"User metadata","displayDescription":"Attributes, which refer to user metadata"}]}
6ec8f46d-4e8e-471d-8787-1ddf1af7f614	b06fa115-261e-4ae8-86ee-332cd7c6b11c	kid	63abe760-8121-485d-b884-bdf55b8e9eb5
21854026-ddc2-48e7-bf16-daf569f0247f	b06fa115-261e-4ae8-86ee-332cd7c6b11c	secret	9ShRH1Jp6dBjolpW3I86IA
a0609ecb-3c5a-454f-96a3-b47b5df1c543	b06fa115-261e-4ae8-86ee-332cd7c6b11c	priority	100
05e180e7-4980-498a-8077-546d855b668e	c6141c5a-a4e0-4eb3-9ac7-7f2dfbe9b698	keyUse	SIG
105064ca-70ed-43ff-8257-ced4194ad373	c6141c5a-a4e0-4eb3-9ac7-7f2dfbe9b698	privateKey	MIIEowIBAAKCAQEA+kxhRhvrdAYVJZgZaArn+8j406F4RjdVw/Han2QgxT7jpweu1xiI8dEFvM1tkazMGVrRC2yuyotcgrUXaiUdrCqlEbjYUNfHdjVYmwtq4qDZalCAtqN4Xz1elqJR0t9wL6LNYnQXUtcLX7q4SXEHGzrJO3/X+5bSlo0gmO7NjPv/tPimf0PKFuVFym7hlcuFdtIA1lQd68RpdUdVvkIFUjhRrv4vvpRJC3PoGe30r7pNHjqYgC7NKtwe+JHPgyenucfMq3/4TQA84do9iJjZTAEXGR73F2/e0DjwmCGXcQjCcGlVvhCWCC5QPu9UH4Lh08Ik/ptJyqPoCLCSeV0eXwIDAQABAoIBAHGaExhP+biqPhTXCMj5EjtsBst+4Oj1mn6ZmcF4H4uGtKqNySQlJZqjZPhBQLa6d9QWLQUDaf3R7MYCTUNG30XSASOfAscGeKhFJBcSwotjt+oR6al7XlnTr8esmnicIv3r5U4HJMLbiXUEeToUC8anEshniO7OkHv2R9JBqJeQrsF50PKdFpwd2rQ87ZCDK/8blJ8sz3hsO0Z3UsrCtaIzCjJD3BrUNbF4mNeBGzIxpO1tG2hmFiJBh34YgSkIVA+eBHob20k+7uPGRJ+5wifa/k5ObPbQrxelAs7ChZKOWld5oZ8uPjnecDw7A4sYvnVw1s+B7nfVCYszh+yxCLkCgYEA/SS6hBEDTB45eO4cyQwIxVSik3zHgdwr+sf6zBnjtDV5nq6GY26qC/bu6AQjbiQLp/Cifeq+OQxfAd2pD1GgRJ5CRJGiIepY6ehz9E5JVGGAuAAZc7MeljVEIuCEMiHUA7G/dFram/AQZlPI66/0VqYgJj5fkzWisWTn9cf2kpsCgYEA/R9uu1AIw10dCY+3rhA/fRP2XlMxppN3dHImaKB5VnvH08o4hR85sqOQw0DrLmDQjcJdmS5Lm/B/oQLqELp2ZaoCjHakQbLj2AHZimwG6nehHiaNoZKfmnwO3mYKKWPuXLN+G2NmvxQb7vBhcRn/SuCpk0UlPevOMOFGv2jdjY0CgYAKkHDUOB2KHKzLViyPW1g2W/zY6NkumzCeq5/UyrPM/npP2/qxxZmFHE4GEr4jx49Q9+LgHF7J5LFGU6jNgduNYYlkcStx/OSvBktog6fdxJ/pjd+CC5SYMirgxbvel7jQWqehxHThExisHI0DAPnSb+ZhkjLM4u0iOBLSGAE7RwKBgQDYhhPV3W+xlqwpKqxIFJQKrZHZPDdDs+/CR4c9htBkv3u/WsOgdIaJnktOCvFi+eRM70/bofOBkGfM1s5cwvRWoOiPOUnm/VzTwTlSpHgCB5VmUjpjVSZ8ItUhP44/u8EBwXUFfrE8kLoYWb4w3rk4VxgX51UlM9psi7hWMiEbXQKBgEICw8mMQs40xtgADCVN1RhI4rX14vQTB1he7GMcW59ptox6MoWuIAHFFryFqNZoSOVsOZ28sICeDwyPZ571SzhgWnHSwuJezruENe6BtlhGqy3YubEDjOb/HpxMuE254T0rvvevuWC+qlsz+Q+03sid8Mj/UV7H53WGN1PB+Xbd
09b742f8-f85a-4469-bc5c-d2876de0d4da	c6141c5a-a4e0-4eb3-9ac7-7f2dfbe9b698	priority	100
011da049-f098-47cd-8ef8-52bda97c3a32	c6141c5a-a4e0-4eb3-9ac7-7f2dfbe9b698	certificate	MIICmzCCAYMCBgGVPMgbojANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjUwMjI1MTEwMzIyWhcNMzUwMjI1MTEwNTAyWjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQD6TGFGG+t0BhUlmBloCuf7yPjToXhGN1XD8dqfZCDFPuOnB67XGIjx0QW8zW2RrMwZWtELbK7Ki1yCtRdqJR2sKqURuNhQ18d2NVibC2rioNlqUIC2o3hfPV6WolHS33Avos1idBdS1wtfurhJcQcbOsk7f9f7ltKWjSCY7s2M+/+0+KZ/Q8oW5UXKbuGVy4V20gDWVB3rxGl1R1W+QgVSOFGu/i++lEkLc+gZ7fSvuk0eOpiALs0q3B74kc+DJ6e5x8yrf/hNADzh2j2ImNlMARcZHvcXb97QOPCYIZdxCMJwaVW+EJYILlA+71QfguHTwiT+m0nKo+gIsJJ5XR5fAgMBAAEwDQYJKoZIhvcNAQELBQADggEBALsAXUqn1g/juR/EPGeciW3Bz2xTyA01CRZs1RPZ8AMiifYHyRxUWqvpgxrg0mkIGyXDvZmRogzSw8CrVKuVEuI4/uv0DAXmj+VkwDVEskE0VIQXL2+OvK0lSg7plzdy2h4BaT6dpBBeyAgrbE/iZjqyKbSmUbq8vtIs+gIH0Eviv6NMCTNeC9eTEnAFec+HAzJ75v3jONtI+25WNoI0LuRtcGZM+PS9joQk6CUHdpuauE/ex4+iMsEGpS8S+eXRrxuXI/MhpYToavxhX3WFOz7KsFBkPeIq7yNYP986yiXjPGiS/PtSCLLgFiJP3CGUqj377Y8QBFCpNE11MfCgCRc=
579eddba-1793-4575-bdd1-2fa1365f1263	afbb8b33-44fd-4b67-8bec-f3b64775feb2	priority	100
53c5120c-6cf8-438b-a34e-21ef2cbf729a	afbb8b33-44fd-4b67-8bec-f3b64775feb2	privateKey	MIIEpAIBAAKCAQEA7dBgDuUYpgPQdYBMOBEqhHqmajIzd+xYHLZLK8KTx4M/SoyHruy8oIbddfCCIo+r6qPmXU04jV5riwjXQ5z1cHqfr6FFzcC8DaxK1PkeiAhYvVPaI3UyVcofJyYCjXwcsD7SE7YOFxFyXjSpEOAuiV2hWQTSLE6QIox36WroI/s8nT+Ie2DqOXm1KxdV/kq3m6i0EsFnV5W13HyOnKtnzkNPjCKJd2YFIvkiuSdlhZ+RTHjnHpFN0O9moXwlAySZSqQlzmWEhp/+S5MVemT93xHC0zemDUtRy5Lr9jw3EAK5FFyfoTHQSC+QwKOkoSlrtS3jYyuUu3tRxsRuYQrtGQIDAQABAoIBABLzbHwzYHP2UNnUN/6ty4QUHAfRaU2QrXLYSgQ6NLmM6XHA4h0b62olZSd9W3lyloITvotH2I5XbF1/flv6eYqVkv0VbnEXf0TdqnbvRTIU7DFmKbdyoui4OyRNAJ4SulyHHQmKE/RdpQ4Bx0k7fCnhJrbnzfHO7uh55iJZLReUyewW2aoQdZR5cf7APbJME1EvfWpxxU4SftABf2Z2mEb9pIVQ0U8MaYlj+ql62jW2XfYLX7GU3fjNEYXtmaq1dF/fp7p+8FMSfgqnNjLlrvrPR61ZZ2fj7Hf2SD0SO4c4K8qO9Bjh5Cab573J2LFTGWdgF9agJof+KZT5BkNz0dMCgYEA9yDTQy+s8e+o7OTf++evX6iTVq0OfOJrW/5mCrkZV+bKWu9nM5m2+REli1jiEz88rs/ZHNGL9mDnAlo3HtX77sERi5BfJBr1Y7Ka3PQMUeSm2LQXeuWVduj52zNyC4uplQwc67+INmAkilDp/Fqat76VxC5GdpgB+r1sjKARXv8CgYEA9lnzD0G/BDpGgIzjuofZ4sHzopDZxoKbOOC+iAIoj+mJAjFEKjitFQy6UdIRIbgB/aXCSadPbj9hON9eVm3oFHmj4Ge1A7ODI2bJXb/HCxlowiP5eve0dwPk0GHOxdrIaaCiyUlDl3rgMK5XnvQkircdfcC+7Kv0/GT0Nx72y+cCgYEAg2q2Td01h/bdixRvNANR1HnN2GLw+GJjmyke1Ib4PjFh3JfA9sTAc5S1tXOPzZJsT74CA/w/BMclMbAN7dz3O1D6ZpBgt8+KPPlGt0ckogwI2eZzMgySvghIjlO+Svt7M+KcIpXY9qmL5O4AcA0yh5HXDNta50gQjWlcJzAb7LsCgYEAm4y+SYLk/uFhBOhxHqWK8YAvuxUlPQ/YvPhDthNO01fNV+INvW8d8q2fs+wlPxo1v5f7bpBDOkSwub1ojsBFCzCnRhmVlWmywxayzQw7vQllOTiH3Zosi/2ca+tmKU30v6VbRCeLk0lV58cdslNMA36OE4oxw7TsMrX38hoOET8CgYBx9DIf9ShXICagVMVPKhAC+Y2qa0/3ChZrtkjI1dP1yP9dgGwf8qh61g4OgdqQEqNaJ8eIZeIp5JjcZ/xSU9vtr8HU4C3c719LDsD5ovnMg6+0rDDkQRtpb4DoSAGj6T/XaQPJFdKNtR7jla0X3xy2TBGFuj0QzjCMjd9malYsbg==
72d15894-1ace-4281-8d92-d435294419bb	afbb8b33-44fd-4b67-8bec-f3b64775feb2	certificate	MIICqzCCAZMCBgGVPMjuqjANBgkqhkiG9w0BAQsFADAZMRcwFQYDVQQDDA5tZWFzdXJlbWFuYWdlcjAeFw0yNTAyMjUxMTA0MTZaFw0zNTAyMjUxMTA1NTZaMBkxFzAVBgNVBAMMDm1lYXN1cmVtYW5hZ2VyMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7dBgDuUYpgPQdYBMOBEqhHqmajIzd+xYHLZLK8KTx4M/SoyHruy8oIbddfCCIo+r6qPmXU04jV5riwjXQ5z1cHqfr6FFzcC8DaxK1PkeiAhYvVPaI3UyVcofJyYCjXwcsD7SE7YOFxFyXjSpEOAuiV2hWQTSLE6QIox36WroI/s8nT+Ie2DqOXm1KxdV/kq3m6i0EsFnV5W13HyOnKtnzkNPjCKJd2YFIvkiuSdlhZ+RTHjnHpFN0O9moXwlAySZSqQlzmWEhp/+S5MVemT93xHC0zemDUtRy5Lr9jw3EAK5FFyfoTHQSC+QwKOkoSlrtS3jYyuUu3tRxsRuYQrtGQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQBqPLHN4+JVJZIG+jwiLF8pQ90FutpOjC+qhPJ6DqcTO6FdYXLhVNG1RMpSYcFhqmuXGHn+Co4ubuTvHJFf/g4ZB2+Ds9fMeW+GaohjqHpwllAu+XBtnT/I2miBUv6S8rwTIev8leSSRm14yIlV0VwddRQDDMTCC8pV3KCALya1IDk68r+0J1FA5Jxk6woAtQ+5rQsjxmogLU0uOc6t18EQb+3pzI2EbBhBSSRihQE//8Q3iYAh7ZU42A4YIZF/q7clL49fQqP3DUpO6VBWlHU+o8mBqeixXw8VNuOmcxdVm3PC8Jq/FEdDJJTdB6VSC+8K702hmr/bL/ctn/LLCBvj
5ff37b60-c08a-4f85-bd92-a4e2d34dd83f	afbb8b33-44fd-4b67-8bec-f3b64775feb2	keyUse	SIG
1f66b447-ebea-4694-ae6e-9e1eaa72d80f	e2808e3c-2add-4a05-b807-92735746fd59	priority	100
3ec9516d-1a25-4ed9-aa16-c98cfc820038	e2808e3c-2add-4a05-b807-92735746fd59	secret	VugAOec7AWgTD6ZVN48OKQ
c2511e4e-ad82-437c-9f50-c3f1c65843aa	e2808e3c-2add-4a05-b807-92735746fd59	kid	d876d6ea-8440-4a45-a578-a940f8a17346
133465c4-c314-4087-b4bb-582c98a6c932	a4d5dd10-cea7-42f3-a962-64ca2f6125e8	kid	98e989e8-3bcf-48ba-9c7f-6380e91c3e94
09c6369a-2487-4855-a4c4-659accf87a40	a4d5dd10-cea7-42f3-a962-64ca2f6125e8	algorithm	HS512
7c2071f9-dab5-4cd2-a129-230e5e3720ab	a4d5dd10-cea7-42f3-a962-64ca2f6125e8	secret	r6H5J_LvOdIUfTlY1G2zfgOL1Fp_07eEXTTxPvzso4Og_6VbhGpbteQiF7tKBL7WqrexcEh4q4bhPQA1t02mgzBX3gXr-8jCkh_Pnsd82u0i0mOgmDHzgVmIJRf8W1mTgFIkCdFawWo5-R1WV_MH0HN6Zz3UkA3kro4dfb55MG0
5e83b779-63b8-4b57-a2ed-587ab1bf6997	a4d5dd10-cea7-42f3-a962-64ca2f6125e8	priority	100
7d26ba8b-10ac-4463-8134-6fcf995ffe6a	b2526def-aa85-420b-9039-f84224b7af18	algorithm	RSA-OAEP
7324f887-a0bf-4c80-b79c-c328f68ed163	b2526def-aa85-420b-9039-f84224b7af18	certificate	MIICqzCCAZMCBgGVPMjwSDANBgkqhkiG9w0BAQsFADAZMRcwFQYDVQQDDA5tZWFzdXJlbWFuYWdlcjAeFw0yNTAyMjUxMTA0MTZaFw0zNTAyMjUxMTA1NTZaMBkxFzAVBgNVBAMMDm1lYXN1cmVtYW5hZ2VyMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoou8PPiurVPjdxiLIMau+uXiEsixYIPL+Ci5NGXRdoASSHL5S1tavwXdfyzZwGj6OuWRC7EGb4JLWtbfUW6qxxMu577Q7wo1b4wvq03U5/o4vHlB5eiitPkdchyPaRESqvV1NlZQI729Yy5AgfVAb8mf6PEWWlu2+iXn3b8sFg1to5I/e6sZHtQIp3IWObDb/t3ZS4sNTEZPXxrts6Y5hGvAatAt2M+V18QV2vvYdt2J/Z13QsinOfXp1HHSMZnJJjB+q7XikLpNNqH+yX2WO2SY60AZWG4Et8ECXYDvhdXycKUm8yJ+Vmrc6bQnT8euefT4gBXc1RMU+w/v4Gt32wIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAFmxwc9WYUMB5w1tvfEwfjCWRCvcoUABJo1g4xfDMac3AZtuXK3BPG+ntjM1ppdl0qkwEn31XprIX/tPg3bhODLDKlqQsJa94vMZPcziwx8PqMiwtwpkUa23ZNg43MaCF1uO+aM2u+d4Ka39w+WlBuEvM6D+X2lQocBkb86RSXgJU7bQW3kazXP7ieIG23A1OM24FxkIXVcWB01f812lUxbwFMji4ScK7mU/laCblskD7+ZGipzQYxxthbr0iwE5TnfBiGquL+mTg0yEIAPlK+8a+lj2Xt3ECku17yZCy0Z975wzqhNPGQA5G4VKMHcUCj2qSVyMzB+wl2Lz+dHJCr
fbf7d6c1-14d2-405c-9cbc-a0b6bbab8620	b2526def-aa85-420b-9039-f84224b7af18	priority	100
d23774f7-2fdc-47c2-9ecc-53e145b8075c	b2526def-aa85-420b-9039-f84224b7af18	keyUse	ENC
c477b5ab-6800-4ae7-a985-78f21902e6c0	b2526def-aa85-420b-9039-f84224b7af18	privateKey	MIIEpAIBAAKCAQEAoou8PPiurVPjdxiLIMau+uXiEsixYIPL+Ci5NGXRdoASSHL5S1tavwXdfyzZwGj6OuWRC7EGb4JLWtbfUW6qxxMu577Q7wo1b4wvq03U5/o4vHlB5eiitPkdchyPaRESqvV1NlZQI729Yy5AgfVAb8mf6PEWWlu2+iXn3b8sFg1to5I/e6sZHtQIp3IWObDb/t3ZS4sNTEZPXxrts6Y5hGvAatAt2M+V18QV2vvYdt2J/Z13QsinOfXp1HHSMZnJJjB+q7XikLpNNqH+yX2WO2SY60AZWG4Et8ECXYDvhdXycKUm8yJ+Vmrc6bQnT8euefT4gBXc1RMU+w/v4Gt32wIDAQABAoIBAA8k6cLcgJnRiQ3dkYjaOg9SP7/0RuJxJR3X3XmOSve5cvqhC60Ds+68QyjIKvmMTlQSc3MdaTYWc6LhBil2IB8wIFyjIKBE2TmtW/uf4shCPesBeSxMgmxOEXpCQvJNDuoyuFr5q7nIwc5tzsDM8tX3eRig7a45gVDJG1NDrn3XWGvLD9mRZjtT6fHrU8tm5/tlYOSzsdzhffhJHlM2H7YviKeC2jZzSTJdeGlDSMdr50uQ2lX2kOBNQBSgJLisA/fZwHWQaDUIKD/2bSgtrzWreF7lpNfkcCjahUi0uKMyy43V6y5LBFL8y07Z0UJ0fu72UhFlyoS3hVc5iJQ7EMECgYEA0Rpt9rqgYCMtKw6kENeM+U4DA2fx8Z6hEpfnLYx6p6tibj3mtBntZEpe15Ni/nT9KRiwwCRnbBIIFBAEqg5qWGgCuUn7x8N3QhV8KDktvqFJ7rdLD27dGek0GwOjt80xQF+uKLI7th+wiShMiCy6yFp0c423c8B1wsVN3518hcsCgYEAxwA7saBfAI/lXaVUR63/LyaxkXZl70vmsKu8p7z+q5POa/VBR7cbOkmdebMxH/5+aMxvBn4EXy0J6M6QJoKT87mpm3wFKWpimhePcdUJA1DfdrPUrsjk2dCIygkH14vj4226KGwTs2sWosJHq14tH6sQHVFLjBv96omoPs8mFDECgYEAnQnvWeQxO+JPMs4NE4T+n+EhzDYNc3vB1lf0y7V8DF5fTxH4KHxsV+yuq9JJ/3ZXBr0/SR5N+dDU9lRNXHX1Ei4TFZrll9JJx3yhQQgoPcmd38USfyWwsZv9gOhL1WcqPQFep7ursoy8JVX5nC+Tm5KrcHkXNLxu9Hb/lBgPg98CgYAE+g2EILWfhvm+gM79x+002avhLmvYMza+vlzGeSSJV/X2nziVuY+VwpeMnp2g5jV1G3+/UtF7K94uk1PpkqRumPsT52MdqQp0PhiZSTGjgpdEGbU89cs7Y0q4esdWbaoyWuEn96P6fbggM+mk8IMCYr3RbeIMy/pqriyl/Xo/UQKBgQDRCXQfcW0WYtkxNO8mEpErjudEBfm2wu1V6g7KhQEkmkeBc7SxONyt5aGUEg6ACPdu32FwOtp+3sItzT02UUbvXmHpvDUR8WbUOm7rpn2Z0eUvCAOkBw1almbOsng7cPPLFx4PKLO/ngEe3xB0XtqKte4jQDfRW8ThBvvorkK/JQ==
13ce2555-bf78-4411-9a3d-80d426f87df4	80e7cdeb-b028-42ff-847f-a1eab55829ac	host-sending-registration-request-must-match	true
41825a22-979e-468d-8025-408ec4979b73	80e7cdeb-b028-42ff-847f-a1eab55829ac	client-uris-must-match	true
9a6af5c7-d765-4c8d-a2ea-bf97bcf7b68f	99aeb48e-ec34-4b1e-8c01-35889e31e688	allow-default-scopes	true
cf45cc7d-9a57-486b-9b0d-3140a91ba1e9	b8037297-592e-4cb2-9dff-9d4ae440c29a	allowed-protocol-mapper-types	saml-role-list-mapper
c16f1bdc-80a3-4728-99c1-9e45c386f90b	b8037297-592e-4cb2-9dff-9d4ae440c29a	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
2270be72-29a2-4949-9638-8de59b9535f9	b8037297-592e-4cb2-9dff-9d4ae440c29a	allowed-protocol-mapper-types	saml-user-property-mapper
99dc40b0-7114-4c1e-95d4-93fbd20cd264	b8037297-592e-4cb2-9dff-9d4ae440c29a	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
441e8d8e-9d0e-4c9f-94da-c91fc05a5f97	b8037297-592e-4cb2-9dff-9d4ae440c29a	allowed-protocol-mapper-types	oidc-full-name-mapper
66975fb5-9d6c-4586-979c-a331d52ed2ac	b8037297-592e-4cb2-9dff-9d4ae440c29a	allowed-protocol-mapper-types	saml-user-attribute-mapper
c58a8980-6371-4d8a-bd31-2b6542967a8e	b8037297-592e-4cb2-9dff-9d4ae440c29a	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
1472311b-f367-4747-83be-ad234be949f1	b8037297-592e-4cb2-9dff-9d4ae440c29a	allowed-protocol-mapper-types	oidc-address-mapper
6cfdb1dd-4836-48a6-84b2-f747bbf7edd4	d94be5f4-d1c0-4f48-9703-87726ac2f7e4	allow-default-scopes	true
371494e7-c99d-49e8-b5af-51a76aa7c290	4f30309d-2dee-4800-bd82-30e28c6c00f3	allowed-protocol-mapper-types	saml-user-property-mapper
76b1245b-1f00-4574-b4b1-51bfbffca624	4f30309d-2dee-4800-bd82-30e28c6c00f3	allowed-protocol-mapper-types	oidc-full-name-mapper
a43aead7-e566-46a6-a654-05e36fde9c2a	4f30309d-2dee-4800-bd82-30e28c6c00f3	allowed-protocol-mapper-types	saml-user-attribute-mapper
255318e3-4a2b-4e26-935d-40879bc6119c	4f30309d-2dee-4800-bd82-30e28c6c00f3	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
e997ebb6-8881-40d7-a289-91ff601ece1e	4f30309d-2dee-4800-bd82-30e28c6c00f3	allowed-protocol-mapper-types	oidc-address-mapper
ef3dc824-d658-4f02-9998-8d804672d0cc	4f30309d-2dee-4800-bd82-30e28c6c00f3	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
3ce57d44-bbab-453f-a3e4-0fdd8cd33f6d	4f30309d-2dee-4800-bd82-30e28c6c00f3	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
6cd6e42e-65a6-42e0-8487-d9c1363a7b5b	4f30309d-2dee-4800-bd82-30e28c6c00f3	allowed-protocol-mapper-types	saml-role-list-mapper
1472fe28-f66f-47b4-8ffa-dc8bd2fcec29	09a4616b-41f3-4ea4-9d87-291723501565	max-clients	200
\.


--
-- Data for Name: composite_role; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.composite_role (composite, child_role) FROM stdin;
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	576695fb-214c-46fb-920a-5f37daccd8db
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	4a113f85-5fef-441b-b9fc-e9e274176d68
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	fead0a36-0ac3-45c9-8dd5-4c46fc821e5b
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	dc2de297-3b8e-4ffd-a880-8c9b1a6257a8
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	f365b4ce-2639-4f36-8360-4e4bf1893736
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	2d16f16e-a30d-48c1-b543-28e3cef5ea64
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	b997a6f3-72b8-4a3d-b638-c1c9f1340d07
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	3fdf4e0f-4d93-4962-bbf5-2ada51626463
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	8833c6b0-ad0b-4f81-be0a-f40c36cda8fd
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	ee457df1-997d-4007-a91f-68f606b76802
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	f80e1181-0306-4dfe-91a6-6c2ada6a7013
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	152d8406-23ba-48d9-b26b-c59d471bfd8a
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	381d870b-aeb0-444f-8294-5e24ad05c049
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	1496f35b-23cb-4df8-a7a7-5dd0ab9deb54
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	bf942e68-e846-479d-ab68-6920f2b89a14
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	cc914a24-45b0-4b47-bc25-50eda3b6205b
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	1cdecf67-791e-4486-82df-fd4d73e95e9e
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	b8657608-3715-456a-a893-067c084a3685
cede3fb9-55db-49b4-a1ab-e107fd07dc5a	a7832ee9-77ca-499a-97c3-a77907495d57
dc2de297-3b8e-4ffd-a880-8c9b1a6257a8	b8657608-3715-456a-a893-067c084a3685
dc2de297-3b8e-4ffd-a880-8c9b1a6257a8	bf942e68-e846-479d-ab68-6920f2b89a14
f365b4ce-2639-4f36-8360-4e4bf1893736	cc914a24-45b0-4b47-bc25-50eda3b6205b
cede3fb9-55db-49b4-a1ab-e107fd07dc5a	b96ee64d-e253-423d-ba83-74f97ac4c3c9
b96ee64d-e253-423d-ba83-74f97ac4c3c9	d493680e-317f-4f53-bf44-f690880e7068
ae71d77a-88db-4339-b282-65b25c88cc11	dcee6162-9793-4730-9042-1f09a12b3442
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	9e671124-9283-440e-b033-78ea9bbd9dbd
cede3fb9-55db-49b4-a1ab-e107fd07dc5a	55cab3c6-7f3a-40f6-a08e-26b93a97e44c
cede3fb9-55db-49b4-a1ab-e107fd07dc5a	e94135e9-92a3-4602-8702-a617e18c9c1c
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	241518f2-7833-4787-b9ab-91c5e4506137
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	1ad95ac4-b903-41b6-a501-5107b94aca0e
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	c8ee5ce7-48c6-4f90-bf39-fd05696fbb58
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	1fb6b3e9-0cf3-41f2-b20c-b9adb9c6099d
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	e208c4f0-2621-4d0c-8255-9b5bacfcbb7f
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	39e5273b-84c6-4036-8bea-8c1a19e333c4
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	90d43c43-9a56-418f-913a-2d8338b71bba
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	97666f7d-c39e-48fc-b9f0-f10c1b39e9b5
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	2a6b71a9-f62f-4be9-96f6-483cd04b4dd9
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	6bf338fa-76c7-41e6-ae8e-5b497e41c651
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	250ebd74-74ae-4230-91d8-8f68bd2369ac
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	29685447-f932-4dba-b382-797b974fde89
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	5b13cf67-2cca-4795-9f92-8e0c56a6a167
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	27f60849-2057-4b4d-80d7-91b147707880
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	5cbb362f-b55b-43ac-b3fd-a78ac7b096d9
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	81ed6a28-0575-463e-b063-a5b60fe881c1
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	096af03b-cebd-4661-8447-98a1e2320e20
1fb6b3e9-0cf3-41f2-b20c-b9adb9c6099d	5cbb362f-b55b-43ac-b3fd-a78ac7b096d9
c8ee5ce7-48c6-4f90-bf39-fd05696fbb58	27f60849-2057-4b4d-80d7-91b147707880
c8ee5ce7-48c6-4f90-bf39-fd05696fbb58	096af03b-cebd-4661-8447-98a1e2320e20
22527c7c-af82-4146-bb98-3b91a3338657	e251a6fe-bba4-420c-9195-4e1301a1d686
22527c7c-af82-4146-bb98-3b91a3338657	2098e727-0f3e-4847-82d7-551fa64d1960
22527c7c-af82-4146-bb98-3b91a3338657	30e56bbd-d0f3-4a20-a12c-2b57de0e9a7f
22527c7c-af82-4146-bb98-3b91a3338657	548712bc-a979-458d-9967-c97089552f7f
22527c7c-af82-4146-bb98-3b91a3338657	aa74337f-bec8-4ae9-8845-9008b48db535
22527c7c-af82-4146-bb98-3b91a3338657	0fdfe4a5-df5f-4fef-8302-0149068cd62a
22527c7c-af82-4146-bb98-3b91a3338657	df324fdc-1d82-4193-9a26-15eb51da19fa
22527c7c-af82-4146-bb98-3b91a3338657	e9ffc1a4-4baa-4ae5-b4b4-c7867be56984
22527c7c-af82-4146-bb98-3b91a3338657	50aa573a-7f03-4a91-91ba-b65a2c3b4bf8
22527c7c-af82-4146-bb98-3b91a3338657	e53375ea-09af-4a4e-b793-c38412ce74ad
22527c7c-af82-4146-bb98-3b91a3338657	6c91c39e-b953-4836-b61d-7031f8f6f0e7
22527c7c-af82-4146-bb98-3b91a3338657	e0e09cd6-d042-4505-ad1d-7d3aea4e44f4
22527c7c-af82-4146-bb98-3b91a3338657	46aca8eb-78bb-45e9-928b-67ec70e18fe4
22527c7c-af82-4146-bb98-3b91a3338657	d1afcb18-4e7c-49a7-af3c-2e910a90889a
22527c7c-af82-4146-bb98-3b91a3338657	5bc489b9-8cf7-4b50-aabc-e1f10db6f683
22527c7c-af82-4146-bb98-3b91a3338657	f5c214cb-ccad-495c-934e-44e040937a66
22527c7c-af82-4146-bb98-3b91a3338657	04bd5c21-6868-4ec6-b2f9-b7670d7eaaab
04ac6b5d-9ff9-4db2-b2e1-f0e20c3d3152	55c359ef-bc71-41d4-a156-94408f04dba6
30e56bbd-d0f3-4a20-a12c-2b57de0e9a7f	d1afcb18-4e7c-49a7-af3c-2e910a90889a
30e56bbd-d0f3-4a20-a12c-2b57de0e9a7f	04bd5c21-6868-4ec6-b2f9-b7670d7eaaab
548712bc-a979-458d-9967-c97089552f7f	5bc489b9-8cf7-4b50-aabc-e1f10db6f683
04ac6b5d-9ff9-4db2-b2e1-f0e20c3d3152	345e2a60-6d0d-4335-9b46-a0ec4a92d65a
345e2a60-6d0d-4335-9b46-a0ec4a92d65a	bd693411-57cd-4f15-8a7b-52bb50ca99c7
59df52b6-3fc3-4625-ab0e-47ae892958ad	63df746a-58c6-4b44-b194-06cebcc82731
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	6e97c191-8c67-4f9d-b297-223c8fb9a3a2
22527c7c-af82-4146-bb98-3b91a3338657	306a7ae3-acd1-40d4-9b66-e74365e1347d
04ac6b5d-9ff9-4db2-b2e1-f0e20c3d3152	ede82158-5112-476f-afad-c8a8b58d24b2
04ac6b5d-9ff9-4db2-b2e1-f0e20c3d3152	af9a46ac-161c-4fcf-8c43-32dccb979b91
\.


--
-- Data for Name: credential; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.credential (id, salt, type, user_id, created_date, user_label, secret_data, credential_data, priority) FROM stdin;
6857209b-c214-420e-96dd-22e25a641ffd	\N	password	5addde5e-fc0d-4716-bb94-47bdd9e711c4	1740481504084	\N	{"value":"JSxK0uiZMIvTqA4xBtIB11qhraxFzOsP3Fgyp24Gux37tcshpW/Ai1u+F/Hq/QdCodjYBBX6Q2aKNbulYS1hOw==","salt":"8GXrcfEoV6xMwfqkXrozBA==","additionalParameters":{}}	{"hashIterations":210000,"algorithm":"pbkdf2-sha512","additionalParameters":{}}	10
\.


--
-- Data for Name: databasechangelog; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) FROM stdin;
1.0.0.Final-KEYCLOAK-5461	sthorger@redhat.com	META-INF/jpa-changelog-1.0.0.Final.xml	2025-02-25 11:04:55.738167	1	EXECUTED	9:6f1016664e21e16d26517a4418f5e3df	createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...		\N	4.25.1	\N	\N	0481495017
1.0.0.Final-KEYCLOAK-5461	sthorger@redhat.com	META-INF/db2-jpa-changelog-1.0.0.Final.xml	2025-02-25 11:04:55.770192	2	MARK_RAN	9:828775b1596a07d1200ba1d49e5e3941	createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...		\N	4.25.1	\N	\N	0481495017
1.1.0.Beta1	sthorger@redhat.com	META-INF/jpa-changelog-1.1.0.Beta1.xml	2025-02-25 11:04:55.856568	3	EXECUTED	9:5f090e44a7d595883c1fb61f4b41fd38	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=CLIENT_ATTRIBUTES; createTable tableName=CLIENT_SESSION_NOTE; createTable tableName=APP_NODE_REGISTRATIONS; addColumn table...		\N	4.25.1	\N	\N	0481495017
1.1.0.Final	sthorger@redhat.com	META-INF/jpa-changelog-1.1.0.Final.xml	2025-02-25 11:04:55.867243	4	EXECUTED	9:c07e577387a3d2c04d1adc9aaad8730e	renameColumn newColumnName=EVENT_TIME, oldColumnName=TIME, tableName=EVENT_ENTITY		\N	4.25.1	\N	\N	0481495017
1.2.0.Beta1	psilva@redhat.com	META-INF/jpa-changelog-1.2.0.Beta1.xml	2025-02-25 11:04:56.043099	5	EXECUTED	9:b68ce996c655922dbcd2fe6b6ae72686	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...		\N	4.25.1	\N	\N	0481495017
1.2.0.Beta1	psilva@redhat.com	META-INF/db2-jpa-changelog-1.2.0.Beta1.xml	2025-02-25 11:04:56.05679	6	MARK_RAN	9:543b5c9989f024fe35c6f6c5a97de88e	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...		\N	4.25.1	\N	\N	0481495017
1.2.0.RC1	bburke@redhat.com	META-INF/jpa-changelog-1.2.0.CR1.xml	2025-02-25 11:04:56.221407	7	EXECUTED	9:765afebbe21cf5bbca048e632df38336	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...		\N	4.25.1	\N	\N	0481495017
1.2.0.RC1	bburke@redhat.com	META-INF/db2-jpa-changelog-1.2.0.CR1.xml	2025-02-25 11:04:56.23387	8	MARK_RAN	9:db4a145ba11a6fdaefb397f6dbf829a1	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...		\N	4.25.1	\N	\N	0481495017
1.2.0.Final	keycloak	META-INF/jpa-changelog-1.2.0.Final.xml	2025-02-25 11:04:56.246969	9	EXECUTED	9:9d05c7be10cdb873f8bcb41bc3a8ab23	update tableName=CLIENT; update tableName=CLIENT; update tableName=CLIENT		\N	4.25.1	\N	\N	0481495017
1.3.0	bburke@redhat.com	META-INF/jpa-changelog-1.3.0.xml	2025-02-25 11:04:56.402863	10	EXECUTED	9:18593702353128d53111f9b1ff0b82b8	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=ADMI...		\N	4.25.1	\N	\N	0481495017
1.4.0	bburke@redhat.com	META-INF/jpa-changelog-1.4.0.xml	2025-02-25 11:04:56.487846	11	EXECUTED	9:6122efe5f090e41a85c0f1c9e52cbb62	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.25.1	\N	\N	0481495017
1.4.0	bburke@redhat.com	META-INF/db2-jpa-changelog-1.4.0.xml	2025-02-25 11:04:56.500237	12	MARK_RAN	9:e1ff28bf7568451453f844c5d54bb0b5	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.25.1	\N	\N	0481495017
1.5.0	bburke@redhat.com	META-INF/jpa-changelog-1.5.0.xml	2025-02-25 11:04:56.558157	13	EXECUTED	9:7af32cd8957fbc069f796b61217483fd	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.25.1	\N	\N	0481495017
1.6.1_from15	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2025-02-25 11:04:56.639816	14	EXECUTED	9:6005e15e84714cd83226bf7879f54190	addColumn tableName=REALM; addColumn tableName=KEYCLOAK_ROLE; addColumn tableName=CLIENT; createTable tableName=OFFLINE_USER_SESSION; createTable tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_US_SES_PK2, tableName=...		\N	4.25.1	\N	\N	0481495017
1.6.1_from16-pre	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2025-02-25 11:04:56.662727	15	MARK_RAN	9:bf656f5a2b055d07f314431cae76f06c	delete tableName=OFFLINE_CLIENT_SESSION; delete tableName=OFFLINE_USER_SESSION		\N	4.25.1	\N	\N	0481495017
1.6.1_from16	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2025-02-25 11:04:56.682515	16	MARK_RAN	9:f8dadc9284440469dcf71e25ca6ab99b	dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_US_SES_PK, tableName=OFFLINE_USER_SESSION; dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_CL_SES_PK, tableName=OFFLINE_CLIENT_SESSION; addColumn tableName=OFFLINE_USER_SESSION; update tableName=OF...		\N	4.25.1	\N	\N	0481495017
1.6.1	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2025-02-25 11:04:56.697355	17	EXECUTED	9:d41d8cd98f00b204e9800998ecf8427e	empty		\N	4.25.1	\N	\N	0481495017
1.7.0	bburke@redhat.com	META-INF/jpa-changelog-1.7.0.xml	2025-02-25 11:04:56.835007	18	EXECUTED	9:3368ff0be4c2855ee2dd9ca813b38d8e	createTable tableName=KEYCLOAK_GROUP; createTable tableName=GROUP_ROLE_MAPPING; createTable tableName=GROUP_ATTRIBUTE; createTable tableName=USER_GROUP_MEMBERSHIP; createTable tableName=REALM_DEFAULT_GROUPS; addColumn tableName=IDENTITY_PROVIDER; ...		\N	4.25.1	\N	\N	0481495017
1.8.0	mposolda@redhat.com	META-INF/jpa-changelog-1.8.0.xml	2025-02-25 11:04:56.917006	19	EXECUTED	9:8ac2fb5dd030b24c0570a763ed75ed20	addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...		\N	4.25.1	\N	\N	0481495017
1.8.0-2	keycloak	META-INF/jpa-changelog-1.8.0.xml	2025-02-25 11:04:56.932807	20	EXECUTED	9:f91ddca9b19743db60e3057679810e6c	dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL		\N	4.25.1	\N	\N	0481495017
24.0.0-9758-2	keycloak	META-INF/jpa-changelog-24.0.0.xml	2025-02-25 11:04:58.777899	119	EXECUTED	9:bf0fdee10afdf597a987adbf291db7b2	customChange		\N	4.25.1	\N	\N	0481495017
1.8.0	mposolda@redhat.com	META-INF/db2-jpa-changelog-1.8.0.xml	2025-02-25 11:04:56.939828	21	MARK_RAN	9:831e82914316dc8a57dc09d755f23c51	addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...		\N	4.25.1	\N	\N	0481495017
1.8.0-2	keycloak	META-INF/db2-jpa-changelog-1.8.0.xml	2025-02-25 11:04:56.946737	22	MARK_RAN	9:f91ddca9b19743db60e3057679810e6c	dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL		\N	4.25.1	\N	\N	0481495017
1.9.0	mposolda@redhat.com	META-INF/jpa-changelog-1.9.0.xml	2025-02-25 11:04:57.003867	23	EXECUTED	9:bc3d0f9e823a69dc21e23e94c7a94bb1	update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=REALM; update tableName=REALM; customChange; dr...		\N	4.25.1	\N	\N	0481495017
1.9.1	keycloak	META-INF/jpa-changelog-1.9.1.xml	2025-02-25 11:04:57.018361	24	EXECUTED	9:c9999da42f543575ab790e76439a2679	modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=PUBLIC_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM		\N	4.25.1	\N	\N	0481495017
1.9.1	keycloak	META-INF/db2-jpa-changelog-1.9.1.xml	2025-02-25 11:04:57.023212	25	MARK_RAN	9:0d6c65c6f58732d81569e77b10ba301d	modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM		\N	4.25.1	\N	\N	0481495017
1.9.2	keycloak	META-INF/jpa-changelog-1.9.2.xml	2025-02-25 11:04:57.072093	26	EXECUTED	9:fc576660fc016ae53d2d4778d84d86d0	createIndex indexName=IDX_USER_EMAIL, tableName=USER_ENTITY; createIndex indexName=IDX_USER_ROLE_MAPPING, tableName=USER_ROLE_MAPPING; createIndex indexName=IDX_USER_GROUP_MAPPING, tableName=USER_GROUP_MEMBERSHIP; createIndex indexName=IDX_USER_CO...		\N	4.25.1	\N	\N	0481495017
authz-2.0.0	psilva@redhat.com	META-INF/jpa-changelog-authz-2.0.0.xml	2025-02-25 11:04:57.179378	27	EXECUTED	9:43ed6b0da89ff77206289e87eaa9c024	createTable tableName=RESOURCE_SERVER; addPrimaryKey constraintName=CONSTRAINT_FARS, tableName=RESOURCE_SERVER; addUniqueConstraint constraintName=UK_AU8TT6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER; createTable tableName=RESOURCE_SERVER_RESOU...		\N	4.25.1	\N	\N	0481495017
authz-2.5.1	psilva@redhat.com	META-INF/jpa-changelog-authz-2.5.1.xml	2025-02-25 11:04:57.186414	28	EXECUTED	9:44bae577f551b3738740281eceb4ea70	update tableName=RESOURCE_SERVER_POLICY		\N	4.25.1	\N	\N	0481495017
2.1.0-KEYCLOAK-5461	bburke@redhat.com	META-INF/jpa-changelog-2.1.0.xml	2025-02-25 11:04:57.266019	29	EXECUTED	9:bd88e1f833df0420b01e114533aee5e8	createTable tableName=BROKER_LINK; createTable tableName=FED_USER_ATTRIBUTE; createTable tableName=FED_USER_CONSENT; createTable tableName=FED_USER_CONSENT_ROLE; createTable tableName=FED_USER_CONSENT_PROT_MAPPER; createTable tableName=FED_USER_CR...		\N	4.25.1	\N	\N	0481495017
2.2.0	bburke@redhat.com	META-INF/jpa-changelog-2.2.0.xml	2025-02-25 11:04:57.295869	30	EXECUTED	9:a7022af5267f019d020edfe316ef4371	addColumn tableName=ADMIN_EVENT_ENTITY; createTable tableName=CREDENTIAL_ATTRIBUTE; createTable tableName=FED_CREDENTIAL_ATTRIBUTE; modifyDataType columnName=VALUE, tableName=CREDENTIAL; addForeignKeyConstraint baseTableName=FED_CREDENTIAL_ATTRIBU...		\N	4.25.1	\N	\N	0481495017
2.3.0	bburke@redhat.com	META-INF/jpa-changelog-2.3.0.xml	2025-02-25 11:04:57.361466	31	EXECUTED	9:fc155c394040654d6a79227e56f5e25a	createTable tableName=FEDERATED_USER; addPrimaryKey constraintName=CONSTR_FEDERATED_USER, tableName=FEDERATED_USER; dropDefaultValue columnName=TOTP, tableName=USER_ENTITY; dropColumn columnName=TOTP, tableName=USER_ENTITY; addColumn tableName=IDE...		\N	4.25.1	\N	\N	0481495017
2.4.0	bburke@redhat.com	META-INF/jpa-changelog-2.4.0.xml	2025-02-25 11:04:57.389335	32	EXECUTED	9:eac4ffb2a14795e5dc7b426063e54d88	customChange		\N	4.25.1	\N	\N	0481495017
2.5.0	bburke@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2025-02-25 11:04:57.408831	33	EXECUTED	9:54937c05672568c4c64fc9524c1e9462	customChange; modifyDataType columnName=USER_ID, tableName=OFFLINE_USER_SESSION		\N	4.25.1	\N	\N	0481495017
2.5.0-unicode-oracle	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2025-02-25 11:04:57.415843	34	MARK_RAN	9:3a32bace77c84d7678d035a7f5a8084e	modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...		\N	4.25.1	\N	\N	0481495017
2.5.0-unicode-other-dbs	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2025-02-25 11:04:57.480675	35	EXECUTED	9:33d72168746f81f98ae3a1e8e0ca3554	modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...		\N	4.25.1	\N	\N	0481495017
2.5.0-duplicate-email-support	slawomir@dabek.name	META-INF/jpa-changelog-2.5.0.xml	2025-02-25 11:04:57.496771	36	EXECUTED	9:61b6d3d7a4c0e0024b0c839da283da0c	addColumn tableName=REALM		\N	4.25.1	\N	\N	0481495017
2.5.0-unique-group-names	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2025-02-25 11:04:57.505918	37	EXECUTED	9:8dcac7bdf7378e7d823cdfddebf72fda	addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.25.1	\N	\N	0481495017
2.5.1	bburke@redhat.com	META-INF/jpa-changelog-2.5.1.xml	2025-02-25 11:04:57.52222	38	EXECUTED	9:a2b870802540cb3faa72098db5388af3	addColumn tableName=FED_USER_CONSENT		\N	4.25.1	\N	\N	0481495017
3.0.0	bburke@redhat.com	META-INF/jpa-changelog-3.0.0.xml	2025-02-25 11:04:57.537228	39	EXECUTED	9:132a67499ba24bcc54fb5cbdcfe7e4c0	addColumn tableName=IDENTITY_PROVIDER		\N	4.25.1	\N	\N	0481495017
3.2.0-fix	keycloak	META-INF/jpa-changelog-3.2.0.xml	2025-02-25 11:04:57.54106	40	MARK_RAN	9:938f894c032f5430f2b0fafb1a243462	addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS		\N	4.25.1	\N	\N	0481495017
3.2.0-fix-with-keycloak-5416	keycloak	META-INF/jpa-changelog-3.2.0.xml	2025-02-25 11:04:57.545823	41	MARK_RAN	9:845c332ff1874dc5d35974b0babf3006	dropIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS; addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS; createIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS		\N	4.25.1	\N	\N	0481495017
3.2.0-fix-offline-sessions	hmlnarik	META-INF/jpa-changelog-3.2.0.xml	2025-02-25 11:04:57.559467	42	EXECUTED	9:fc86359c079781adc577c5a217e4d04c	customChange		\N	4.25.1	\N	\N	0481495017
3.2.0-fixed	keycloak	META-INF/jpa-changelog-3.2.0.xml	2025-02-25 11:04:57.673779	43	EXECUTED	9:59a64800e3c0d09b825f8a3b444fa8f4	addColumn tableName=REALM; dropPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_PK2, tableName=OFFLINE_CLIENT_SESSION; dropColumn columnName=CLIENT_SESSION_ID, tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_P...		\N	4.25.1	\N	\N	0481495017
3.3.0	keycloak	META-INF/jpa-changelog-3.3.0.xml	2025-02-25 11:04:57.685545	44	EXECUTED	9:d48d6da5c6ccf667807f633fe489ce88	addColumn tableName=USER_ENTITY		\N	4.25.1	\N	\N	0481495017
authz-3.4.0.CR1-resource-server-pk-change-part1	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2025-02-25 11:04:57.700666	45	EXECUTED	9:dde36f7973e80d71fceee683bc5d2951	addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_RESOURCE; addColumn tableName=RESOURCE_SERVER_SCOPE		\N	4.25.1	\N	\N	0481495017
authz-3.4.0.CR1-resource-server-pk-change-part2-KEYCLOAK-6095	hmlnarik@redhat.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2025-02-25 11:04:57.723101	46	EXECUTED	9:b855e9b0a406b34fa323235a0cf4f640	customChange		\N	4.25.1	\N	\N	0481495017
authz-3.4.0.CR1-resource-server-pk-change-part3-fixed	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2025-02-25 11:04:57.734747	47	MARK_RAN	9:51abbacd7b416c50c4421a8cabf7927e	dropIndex indexName=IDX_RES_SERV_POL_RES_SERV, tableName=RESOURCE_SERVER_POLICY; dropIndex indexName=IDX_RES_SRV_RES_RES_SRV, tableName=RESOURCE_SERVER_RESOURCE; dropIndex indexName=IDX_RES_SRV_SCOPE_RES_SRV, tableName=RESOURCE_SERVER_SCOPE		\N	4.25.1	\N	\N	0481495017
authz-3.4.0.CR1-resource-server-pk-change-part3-fixed-nodropindex	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2025-02-25 11:04:57.779347	48	EXECUTED	9:bdc99e567b3398bac83263d375aad143	addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_POLICY; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_RESOURCE; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, ...		\N	4.25.1	\N	\N	0481495017
authn-3.4.0.CR1-refresh-token-max-reuse	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2025-02-25 11:04:57.787654	49	EXECUTED	9:d198654156881c46bfba39abd7769e69	addColumn tableName=REALM		\N	4.25.1	\N	\N	0481495017
3.4.0	keycloak	META-INF/jpa-changelog-3.4.0.xml	2025-02-25 11:04:57.818667	50	EXECUTED	9:cfdd8736332ccdd72c5256ccb42335db	addPrimaryKey constraintName=CONSTRAINT_REALM_DEFAULT_ROLES, tableName=REALM_DEFAULT_ROLES; addPrimaryKey constraintName=CONSTRAINT_COMPOSITE_ROLE, tableName=COMPOSITE_ROLE; addPrimaryKey constraintName=CONSTR_REALM_DEFAULT_GROUPS, tableName=REALM...		\N	4.25.1	\N	\N	0481495017
3.4.0-KEYCLOAK-5230	hmlnarik@redhat.com	META-INF/jpa-changelog-3.4.0.xml	2025-02-25 11:04:57.846338	51	EXECUTED	9:7c84de3d9bd84d7f077607c1a4dcb714	createIndex indexName=IDX_FU_ATTRIBUTE, tableName=FED_USER_ATTRIBUTE; createIndex indexName=IDX_FU_CONSENT, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CONSENT_RU, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CREDENTIAL, t...		\N	4.25.1	\N	\N	0481495017
3.4.1	psilva@redhat.com	META-INF/jpa-changelog-3.4.1.xml	2025-02-25 11:04:57.853114	52	EXECUTED	9:5a6bb36cbefb6a9d6928452c0852af2d	modifyDataType columnName=VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
3.4.2	keycloak	META-INF/jpa-changelog-3.4.2.xml	2025-02-25 11:04:57.864494	53	EXECUTED	9:8f23e334dbc59f82e0a328373ca6ced0	update tableName=REALM		\N	4.25.1	\N	\N	0481495017
3.4.2-KEYCLOAK-5172	mkanis@redhat.com	META-INF/jpa-changelog-3.4.2.xml	2025-02-25 11:04:57.875727	54	EXECUTED	9:9156214268f09d970cdf0e1564d866af	update tableName=CLIENT		\N	4.25.1	\N	\N	0481495017
4.0.0-KEYCLOAK-6335	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2025-02-25 11:04:57.88962	55	EXECUTED	9:db806613b1ed154826c02610b7dbdf74	createTable tableName=CLIENT_AUTH_FLOW_BINDINGS; addPrimaryKey constraintName=C_CLI_FLOW_BIND, tableName=CLIENT_AUTH_FLOW_BINDINGS		\N	4.25.1	\N	\N	0481495017
4.0.0-CLEANUP-UNUSED-TABLE	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2025-02-25 11:04:57.904303	56	EXECUTED	9:229a041fb72d5beac76bb94a5fa709de	dropTable tableName=CLIENT_IDENTITY_PROV_MAPPING		\N	4.25.1	\N	\N	0481495017
4.0.0-KEYCLOAK-6228	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2025-02-25 11:04:57.926332	57	EXECUTED	9:079899dade9c1e683f26b2aa9ca6ff04	dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; dropNotNullConstraint columnName=CLIENT_ID, tableName=USER_CONSENT; addColumn tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHO...		\N	4.25.1	\N	\N	0481495017
4.0.0-KEYCLOAK-5579-fixed	mposolda@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2025-02-25 11:04:58.067993	58	EXECUTED	9:139b79bcbbfe903bb1c2d2a4dbf001d9	dropForeignKeyConstraint baseTableName=CLIENT_TEMPLATE_ATTRIBUTES, constraintName=FK_CL_TEMPL_ATTR_TEMPL; renameTable newTableName=CLIENT_SCOPE_ATTRIBUTES, oldTableName=CLIENT_TEMPLATE_ATTRIBUTES; renameColumn newColumnName=SCOPE_ID, oldColumnName...		\N	4.25.1	\N	\N	0481495017
authz-4.0.0.CR1	psilva@redhat.com	META-INF/jpa-changelog-authz-4.0.0.CR1.xml	2025-02-25 11:04:58.112974	59	EXECUTED	9:b55738ad889860c625ba2bf483495a04	createTable tableName=RESOURCE_SERVER_PERM_TICKET; addPrimaryKey constraintName=CONSTRAINT_FAPMT, tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRHO213XCX4WNKOG82SSPMT...		\N	4.25.1	\N	\N	0481495017
authz-4.0.0.Beta3	psilva@redhat.com	META-INF/jpa-changelog-authz-4.0.0.Beta3.xml	2025-02-25 11:04:58.126091	60	EXECUTED	9:e0057eac39aa8fc8e09ac6cfa4ae15fe	addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRPO2128CX4WNKOG82SSRFY, referencedTableName=RESOURCE_SERVER_POLICY		\N	4.25.1	\N	\N	0481495017
authz-4.2.0.Final	mhajas@redhat.com	META-INF/jpa-changelog-authz-4.2.0.Final.xml	2025-02-25 11:04:58.154966	61	EXECUTED	9:42a33806f3a0443fe0e7feeec821326c	createTable tableName=RESOURCE_URIS; addForeignKeyConstraint baseTableName=RESOURCE_URIS, constraintName=FK_RESOURCE_SERVER_URIS, referencedTableName=RESOURCE_SERVER_RESOURCE; customChange; dropColumn columnName=URI, tableName=RESOURCE_SERVER_RESO...		\N	4.25.1	\N	\N	0481495017
authz-4.2.0.Final-KEYCLOAK-9944	hmlnarik@redhat.com	META-INF/jpa-changelog-authz-4.2.0.Final.xml	2025-02-25 11:04:58.1638	62	EXECUTED	9:9968206fca46eecc1f51db9c024bfe56	addPrimaryKey constraintName=CONSTRAINT_RESOUR_URIS_PK, tableName=RESOURCE_URIS		\N	4.25.1	\N	\N	0481495017
4.2.0-KEYCLOAK-6313	wadahiro@gmail.com	META-INF/jpa-changelog-4.2.0.xml	2025-02-25 11:04:58.171903	63	EXECUTED	9:92143a6daea0a3f3b8f598c97ce55c3d	addColumn tableName=REQUIRED_ACTION_PROVIDER		\N	4.25.1	\N	\N	0481495017
4.3.0-KEYCLOAK-7984	wadahiro@gmail.com	META-INF/jpa-changelog-4.3.0.xml	2025-02-25 11:04:58.179235	64	EXECUTED	9:82bab26a27195d889fb0429003b18f40	update tableName=REQUIRED_ACTION_PROVIDER		\N	4.25.1	\N	\N	0481495017
4.6.0-KEYCLOAK-7950	psilva@redhat.com	META-INF/jpa-changelog-4.6.0.xml	2025-02-25 11:04:58.185809	65	EXECUTED	9:e590c88ddc0b38b0ae4249bbfcb5abc3	update tableName=RESOURCE_SERVER_RESOURCE		\N	4.25.1	\N	\N	0481495017
4.6.0-KEYCLOAK-8377	keycloak	META-INF/jpa-changelog-4.6.0.xml	2025-02-25 11:04:58.208808	66	EXECUTED	9:5c1f475536118dbdc38d5d7977950cc0	createTable tableName=ROLE_ATTRIBUTE; addPrimaryKey constraintName=CONSTRAINT_ROLE_ATTRIBUTE_PK, tableName=ROLE_ATTRIBUTE; addForeignKeyConstraint baseTableName=ROLE_ATTRIBUTE, constraintName=FK_ROLE_ATTRIBUTE_ID, referencedTableName=KEYCLOAK_ROLE...		\N	4.25.1	\N	\N	0481495017
4.6.0-KEYCLOAK-8555	gideonray@gmail.com	META-INF/jpa-changelog-4.6.0.xml	2025-02-25 11:04:58.217675	67	EXECUTED	9:e7c9f5f9c4d67ccbbcc215440c718a17	createIndex indexName=IDX_COMPONENT_PROVIDER_TYPE, tableName=COMPONENT		\N	4.25.1	\N	\N	0481495017
4.7.0-KEYCLOAK-1267	sguilhen@redhat.com	META-INF/jpa-changelog-4.7.0.xml	2025-02-25 11:04:58.227859	68	EXECUTED	9:88e0bfdda924690d6f4e430c53447dd5	addColumn tableName=REALM		\N	4.25.1	\N	\N	0481495017
4.7.0-KEYCLOAK-7275	keycloak	META-INF/jpa-changelog-4.7.0.xml	2025-02-25 11:04:58.251192	69	EXECUTED	9:f53177f137e1c46b6a88c59ec1cb5218	renameColumn newColumnName=CREATED_ON, oldColumnName=LAST_SESSION_REFRESH, tableName=OFFLINE_USER_SESSION; addNotNullConstraint columnName=CREATED_ON, tableName=OFFLINE_USER_SESSION; addColumn tableName=OFFLINE_USER_SESSION; customChange; createIn...		\N	4.25.1	\N	\N	0481495017
4.8.0-KEYCLOAK-8835	sguilhen@redhat.com	META-INF/jpa-changelog-4.8.0.xml	2025-02-25 11:04:58.263729	70	EXECUTED	9:a74d33da4dc42a37ec27121580d1459f	addNotNullConstraint columnName=SSO_MAX_LIFESPAN_REMEMBER_ME, tableName=REALM; addNotNullConstraint columnName=SSO_IDLE_TIMEOUT_REMEMBER_ME, tableName=REALM		\N	4.25.1	\N	\N	0481495017
authz-7.0.0-KEYCLOAK-10443	psilva@redhat.com	META-INF/jpa-changelog-authz-7.0.0.xml	2025-02-25 11:04:58.272366	71	EXECUTED	9:fd4ade7b90c3b67fae0bfcfcb42dfb5f	addColumn tableName=RESOURCE_SERVER		\N	4.25.1	\N	\N	0481495017
8.0.0-adding-credential-columns	keycloak	META-INF/jpa-changelog-8.0.0.xml	2025-02-25 11:04:58.294008	72	EXECUTED	9:aa072ad090bbba210d8f18781b8cebf4	addColumn tableName=CREDENTIAL; addColumn tableName=FED_USER_CREDENTIAL		\N	4.25.1	\N	\N	0481495017
8.0.0-updating-credential-data-not-oracle-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2025-02-25 11:04:58.308307	73	EXECUTED	9:1ae6be29bab7c2aa376f6983b932be37	update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL		\N	4.25.1	\N	\N	0481495017
8.0.0-updating-credential-data-oracle-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2025-02-25 11:04:58.313153	74	MARK_RAN	9:14706f286953fc9a25286dbd8fb30d97	update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL		\N	4.25.1	\N	\N	0481495017
8.0.0-credential-cleanup-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2025-02-25 11:04:58.349323	75	EXECUTED	9:2b9cc12779be32c5b40e2e67711a218b	dropDefaultValue columnName=COUNTER, tableName=CREDENTIAL; dropDefaultValue columnName=DIGITS, tableName=CREDENTIAL; dropDefaultValue columnName=PERIOD, tableName=CREDENTIAL; dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; dropColumn ...		\N	4.25.1	\N	\N	0481495017
8.0.0-resource-tag-support	keycloak	META-INF/jpa-changelog-8.0.0.xml	2025-02-25 11:04:58.369403	76	EXECUTED	9:91fa186ce7a5af127a2d7a91ee083cc5	addColumn tableName=MIGRATION_MODEL; createIndex indexName=IDX_UPDATE_TIME, tableName=MIGRATION_MODEL		\N	4.25.1	\N	\N	0481495017
9.0.0-always-display-client	keycloak	META-INF/jpa-changelog-9.0.0.xml	2025-02-25 11:04:58.376232	77	EXECUTED	9:6335e5c94e83a2639ccd68dd24e2e5ad	addColumn tableName=CLIENT		\N	4.25.1	\N	\N	0481495017
9.0.0-drop-constraints-for-column-increase	keycloak	META-INF/jpa-changelog-9.0.0.xml	2025-02-25 11:04:58.379367	78	MARK_RAN	9:6bdb5658951e028bfe16fa0a8228b530	dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5PMT, tableName=RESOURCE_SERVER_PERM_TICKET; dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER_RESOURCE; dropPrimaryKey constraintName=CONSTRAINT_O...		\N	4.25.1	\N	\N	0481495017
9.0.0-increase-column-size-federated-fk	keycloak	META-INF/jpa-changelog-9.0.0.xml	2025-02-25 11:04:58.398845	79	EXECUTED	9:d5bc15a64117ccad481ce8792d4c608f	modifyDataType columnName=CLIENT_ID, tableName=FED_USER_CONSENT; modifyDataType columnName=CLIENT_REALM_CONSTRAINT, tableName=KEYCLOAK_ROLE; modifyDataType columnName=OWNER, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=CLIENT_ID, ta...		\N	4.25.1	\N	\N	0481495017
9.0.0-recreate-constraints-after-column-increase	keycloak	META-INF/jpa-changelog-9.0.0.xml	2025-02-25 11:04:58.402045	80	MARK_RAN	9:077cba51999515f4d3e7ad5619ab592c	addNotNullConstraint columnName=CLIENT_ID, tableName=OFFLINE_CLIENT_SESSION; addNotNullConstraint columnName=OWNER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNullConstraint columnName=REQUESTER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNull...		\N	4.25.1	\N	\N	0481495017
9.0.1-add-index-to-client.client_id	keycloak	META-INF/jpa-changelog-9.0.1.xml	2025-02-25 11:04:58.410073	81	EXECUTED	9:be969f08a163bf47c6b9e9ead8ac2afb	createIndex indexName=IDX_CLIENT_ID, tableName=CLIENT		\N	4.25.1	\N	\N	0481495017
9.0.1-KEYCLOAK-12579-drop-constraints	keycloak	META-INF/jpa-changelog-9.0.1.xml	2025-02-25 11:04:58.41332	82	MARK_RAN	9:6d3bb4408ba5a72f39bd8a0b301ec6e3	dropUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.25.1	\N	\N	0481495017
9.0.1-KEYCLOAK-12579-add-not-null-constraint	keycloak	META-INF/jpa-changelog-9.0.1.xml	2025-02-25 11:04:58.421429	83	EXECUTED	9:966bda61e46bebf3cc39518fbed52fa7	addNotNullConstraint columnName=PARENT_GROUP, tableName=KEYCLOAK_GROUP		\N	4.25.1	\N	\N	0481495017
9.0.1-KEYCLOAK-12579-recreate-constraints	keycloak	META-INF/jpa-changelog-9.0.1.xml	2025-02-25 11:04:58.424906	84	MARK_RAN	9:8dcac7bdf7378e7d823cdfddebf72fda	addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.25.1	\N	\N	0481495017
9.0.1-add-index-to-events	keycloak	META-INF/jpa-changelog-9.0.1.xml	2025-02-25 11:04:58.432822	85	EXECUTED	9:7d93d602352a30c0c317e6a609b56599	createIndex indexName=IDX_EVENT_TIME, tableName=EVENT_ENTITY		\N	4.25.1	\N	\N	0481495017
map-remove-ri	keycloak	META-INF/jpa-changelog-11.0.0.xml	2025-02-25 11:04:58.441184	86	EXECUTED	9:71c5969e6cdd8d7b6f47cebc86d37627	dropForeignKeyConstraint baseTableName=REALM, constraintName=FK_TRAF444KK6QRKMS7N56AIWQ5Y; dropForeignKeyConstraint baseTableName=KEYCLOAK_ROLE, constraintName=FK_KJHO5LE2C0RAL09FL8CM9WFW9		\N	4.25.1	\N	\N	0481495017
map-remove-ri	keycloak	META-INF/jpa-changelog-12.0.0.xml	2025-02-25 11:04:58.451185	87	EXECUTED	9:a9ba7d47f065f041b7da856a81762021	dropForeignKeyConstraint baseTableName=REALM_DEFAULT_GROUPS, constraintName=FK_DEF_GROUPS_GROUP; dropForeignKeyConstraint baseTableName=REALM_DEFAULT_ROLES, constraintName=FK_H4WPD7W4HSOOLNI3H0SW7BTJE; dropForeignKeyConstraint baseTableName=CLIENT...		\N	4.25.1	\N	\N	0481495017
12.1.0-add-realm-localization-table	keycloak	META-INF/jpa-changelog-12.0.0.xml	2025-02-25 11:04:58.460078	88	EXECUTED	9:fffabce2bc01e1a8f5110d5278500065	createTable tableName=REALM_LOCALIZATIONS; addPrimaryKey tableName=REALM_LOCALIZATIONS		\N	4.25.1	\N	\N	0481495017
default-roles	keycloak	META-INF/jpa-changelog-13.0.0.xml	2025-02-25 11:04:58.47152	89	EXECUTED	9:fa8a5b5445e3857f4b010bafb5009957	addColumn tableName=REALM; customChange		\N	4.25.1	\N	\N	0481495017
default-roles-cleanup	keycloak	META-INF/jpa-changelog-13.0.0.xml	2025-02-25 11:04:58.480234	90	EXECUTED	9:67ac3241df9a8582d591c5ed87125f39	dropTable tableName=REALM_DEFAULT_ROLES; dropTable tableName=CLIENT_DEFAULT_ROLES		\N	4.25.1	\N	\N	0481495017
13.0.0-KEYCLOAK-16844	keycloak	META-INF/jpa-changelog-13.0.0.xml	2025-02-25 11:04:58.486948	91	EXECUTED	9:ad1194d66c937e3ffc82386c050ba089	createIndex indexName=IDX_OFFLINE_USS_PRELOAD, tableName=OFFLINE_USER_SESSION		\N	4.25.1	\N	\N	0481495017
map-remove-ri-13.0.0	keycloak	META-INF/jpa-changelog-13.0.0.xml	2025-02-25 11:04:58.497219	92	EXECUTED	9:d9be619d94af5a2f5d07b9f003543b91	dropForeignKeyConstraint baseTableName=DEFAULT_CLIENT_SCOPE, constraintName=FK_R_DEF_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SCOPE_CLIENT, constraintName=FK_C_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SC...		\N	4.25.1	\N	\N	0481495017
13.0.0-KEYCLOAK-17992-drop-constraints	keycloak	META-INF/jpa-changelog-13.0.0.xml	2025-02-25 11:04:58.500184	93	MARK_RAN	9:544d201116a0fcc5a5da0925fbbc3bde	dropPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CLSCOPE_CL, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CL_CLSCOPE, tableName=CLIENT_SCOPE_CLIENT		\N	4.25.1	\N	\N	0481495017
13.0.0-increase-column-size-federated	keycloak	META-INF/jpa-changelog-13.0.0.xml	2025-02-25 11:04:58.518308	94	EXECUTED	9:43c0c1055b6761b4b3e89de76d612ccf	modifyDataType columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; modifyDataType columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT		\N	4.25.1	\N	\N	0481495017
13.0.0-KEYCLOAK-17992-recreate-constraints	keycloak	META-INF/jpa-changelog-13.0.0.xml	2025-02-25 11:04:58.521582	95	MARK_RAN	9:8bd711fd0330f4fe980494ca43ab1139	addNotNullConstraint columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; addNotNullConstraint columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT; addPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; createIndex indexName=...		\N	4.25.1	\N	\N	0481495017
json-string-accomodation-fixed	keycloak	META-INF/jpa-changelog-13.0.0.xml	2025-02-25 11:04:58.53144	96	EXECUTED	9:e07d2bc0970c348bb06fb63b1f82ddbf	addColumn tableName=REALM_ATTRIBUTE; update tableName=REALM_ATTRIBUTE; dropColumn columnName=VALUE, tableName=REALM_ATTRIBUTE; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=REALM_ATTRIBUTE		\N	4.25.1	\N	\N	0481495017
14.0.0-KEYCLOAK-11019	keycloak	META-INF/jpa-changelog-14.0.0.xml	2025-02-25 11:04:58.540895	97	EXECUTED	9:24fb8611e97f29989bea412aa38d12b7	createIndex indexName=IDX_OFFLINE_CSS_PRELOAD, tableName=OFFLINE_CLIENT_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USER, tableName=OFFLINE_USER_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USERSESS, tableName=OFFLINE_USER_SESSION		\N	4.25.1	\N	\N	0481495017
14.0.0-KEYCLOAK-18286	keycloak	META-INF/jpa-changelog-14.0.0.xml	2025-02-25 11:04:58.55014	98	MARK_RAN	9:259f89014ce2506ee84740cbf7163aa7	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
14.0.0-KEYCLOAK-18286-revert	keycloak	META-INF/jpa-changelog-14.0.0.xml	2025-02-25 11:04:58.570054	99	MARK_RAN	9:04baaf56c116ed19951cbc2cca584022	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
14.0.0-KEYCLOAK-18286-supported-dbs	keycloak	META-INF/jpa-changelog-14.0.0.xml	2025-02-25 11:04:58.585253	100	EXECUTED	9:60ca84a0f8c94ec8c3504a5a3bc88ee8	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
14.0.0-KEYCLOAK-18286-unsupported-dbs	keycloak	META-INF/jpa-changelog-14.0.0.xml	2025-02-25 11:04:58.589011	101	MARK_RAN	9:d3d977031d431db16e2c181ce49d73e9	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
KEYCLOAK-17267-add-index-to-user-attributes	keycloak	META-INF/jpa-changelog-14.0.0.xml	2025-02-25 11:04:58.598312	102	EXECUTED	9:0b305d8d1277f3a89a0a53a659ad274c	createIndex indexName=IDX_USER_ATTRIBUTE_NAME, tableName=USER_ATTRIBUTE		\N	4.25.1	\N	\N	0481495017
KEYCLOAK-18146-add-saml-art-binding-identifier	keycloak	META-INF/jpa-changelog-14.0.0.xml	2025-02-25 11:04:58.612232	103	EXECUTED	9:2c374ad2cdfe20e2905a84c8fac48460	customChange		\N	4.25.1	\N	\N	0481495017
15.0.0-KEYCLOAK-18467	keycloak	META-INF/jpa-changelog-15.0.0.xml	2025-02-25 11:04:58.624135	104	EXECUTED	9:47a760639ac597360a8219f5b768b4de	addColumn tableName=REALM_LOCALIZATIONS; update tableName=REALM_LOCALIZATIONS; dropColumn columnName=TEXTS, tableName=REALM_LOCALIZATIONS; renameColumn newColumnName=TEXTS, oldColumnName=TEXTS_NEW, tableName=REALM_LOCALIZATIONS; addNotNullConstrai...		\N	4.25.1	\N	\N	0481495017
17.0.0-9562	keycloak	META-INF/jpa-changelog-17.0.0.xml	2025-02-25 11:04:58.631231	105	EXECUTED	9:a6272f0576727dd8cad2522335f5d99e	createIndex indexName=IDX_USER_SERVICE_ACCOUNT, tableName=USER_ENTITY		\N	4.25.1	\N	\N	0481495017
18.0.0-10625-IDX_ADMIN_EVENT_TIME	keycloak	META-INF/jpa-changelog-18.0.0.xml	2025-02-25 11:04:58.638604	106	EXECUTED	9:015479dbd691d9cc8669282f4828c41d	createIndex indexName=IDX_ADMIN_EVENT_TIME, tableName=ADMIN_EVENT_ENTITY		\N	4.25.1	\N	\N	0481495017
19.0.0-10135	keycloak	META-INF/jpa-changelog-19.0.0.xml	2025-02-25 11:04:58.647042	107	EXECUTED	9:9518e495fdd22f78ad6425cc30630221	customChange		\N	4.25.1	\N	\N	0481495017
20.0.0-12964-supported-dbs	keycloak	META-INF/jpa-changelog-20.0.0.xml	2025-02-25 11:04:58.654433	108	EXECUTED	9:e5f243877199fd96bcc842f27a1656ac	createIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE		\N	4.25.1	\N	\N	0481495017
20.0.0-12964-unsupported-dbs	keycloak	META-INF/jpa-changelog-20.0.0.xml	2025-02-25 11:04:58.658124	109	MARK_RAN	9:1a6fcaa85e20bdeae0a9ce49b41946a5	createIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE		\N	4.25.1	\N	\N	0481495017
client-attributes-string-accomodation-fixed	keycloak	META-INF/jpa-changelog-20.0.0.xml	2025-02-25 11:04:58.674936	110	EXECUTED	9:3f332e13e90739ed0c35b0b25b7822ca	addColumn tableName=CLIENT_ATTRIBUTES; update tableName=CLIENT_ATTRIBUTES; dropColumn columnName=VALUE, tableName=CLIENT_ATTRIBUTES; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
21.0.2-17277	keycloak	META-INF/jpa-changelog-21.0.2.xml	2025-02-25 11:04:58.687997	111	EXECUTED	9:7ee1f7a3fb8f5588f171fb9a6ab623c0	customChange		\N	4.25.1	\N	\N	0481495017
21.1.0-19404	keycloak	META-INF/jpa-changelog-21.1.0.xml	2025-02-25 11:04:58.708622	112	EXECUTED	9:3d7e830b52f33676b9d64f7f2b2ea634	modifyDataType columnName=DECISION_STRATEGY, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=LOGIC, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=POLICY_ENFORCE_MODE, tableName=RESOURCE_SERVER		\N	4.25.1	\N	\N	0481495017
21.1.0-19404-2	keycloak	META-INF/jpa-changelog-21.1.0.xml	2025-02-25 11:04:58.720113	113	MARK_RAN	9:627d032e3ef2c06c0e1f73d2ae25c26c	addColumn tableName=RESOURCE_SERVER_POLICY; update tableName=RESOURCE_SERVER_POLICY; dropColumn columnName=DECISION_STRATEGY, tableName=RESOURCE_SERVER_POLICY; renameColumn newColumnName=DECISION_STRATEGY, oldColumnName=DECISION_STRATEGY_NEW, tabl...		\N	4.25.1	\N	\N	0481495017
22.0.0-17484-updated	keycloak	META-INF/jpa-changelog-22.0.0.xml	2025-02-25 11:04:58.730536	114	EXECUTED	9:90af0bfd30cafc17b9f4d6eccd92b8b3	customChange		\N	4.25.1	\N	\N	0481495017
22.0.5-24031	keycloak	META-INF/jpa-changelog-22.0.0.xml	2025-02-25 11:04:58.733984	115	MARK_RAN	9:a60d2d7b315ec2d3eba9e2f145f9df28	customChange		\N	4.25.1	\N	\N	0481495017
23.0.0-12062	keycloak	META-INF/jpa-changelog-23.0.0.xml	2025-02-25 11:04:58.742908	116	EXECUTED	9:2168fbe728fec46ae9baf15bf80927b8	addColumn tableName=COMPONENT_CONFIG; update tableName=COMPONENT_CONFIG; dropColumn columnName=VALUE, tableName=COMPONENT_CONFIG; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=COMPONENT_CONFIG		\N	4.25.1	\N	\N	0481495017
23.0.0-17258	keycloak	META-INF/jpa-changelog-23.0.0.xml	2025-02-25 11:04:58.74914	117	EXECUTED	9:36506d679a83bbfda85a27ea1864dca8	addColumn tableName=EVENT_ENTITY		\N	4.25.1	\N	\N	0481495017
24.0.0-9758	keycloak	META-INF/jpa-changelog-24.0.0.xml	2025-02-25 11:04:58.76752	118	EXECUTED	9:502c557a5189f600f0f445a9b49ebbce	addColumn tableName=USER_ATTRIBUTE; addColumn tableName=FED_USER_ATTRIBUTE; createIndex indexName=USER_ATTR_LONG_VALUES, tableName=USER_ATTRIBUTE; createIndex indexName=FED_USER_ATTR_LONG_VALUES, tableName=FED_USER_ATTRIBUTE; createIndex indexName...		\N	4.25.1	\N	\N	0481495017
24.0.0-26618-drop-index-if-present	keycloak	META-INF/jpa-changelog-24.0.0.xml	2025-02-25 11:04:58.785813	120	MARK_RAN	9:04baaf56c116ed19951cbc2cca584022	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
24.0.0-26618-reindex	keycloak	META-INF/jpa-changelog-24.0.0.xml	2025-02-25 11:04:58.793909	121	EXECUTED	9:08707c0f0db1cef6b352db03a60edc7f	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
24.0.2-27228	keycloak	META-INF/jpa-changelog-24.0.2.xml	2025-02-25 11:04:58.801763	122	EXECUTED	9:eaee11f6b8aa25d2cc6a84fb86fc6238	customChange		\N	4.25.1	\N	\N	0481495017
24.0.2-27967-drop-index-if-present	keycloak	META-INF/jpa-changelog-24.0.2.xml	2025-02-25 11:04:58.804654	123	MARK_RAN	9:04baaf56c116ed19951cbc2cca584022	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
24.0.2-27967-reindex	keycloak	META-INF/jpa-changelog-24.0.2.xml	2025-02-25 11:04:58.808684	124	MARK_RAN	9:d3d977031d431db16e2c181ce49d73e9	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.25.1	\N	\N	0481495017
\.


--
-- Data for Name: databasechangeloglock; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.databasechangeloglock (id, locked, lockgranted, lockedby) FROM stdin;
1	f	\N	\N
1000	f	\N	\N
1001	f	\N	\N
\.


--
-- Data for Name: default_client_scope; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.default_client_scope (realm_id, scope_id, default_scope) FROM stdin;
767d9b8d-d1e0-46e8-8336-872e7ee443dd	d699ef80-95f8-4619-a866-8a1af6f7ec64	f
767d9b8d-d1e0-46e8-8336-872e7ee443dd	a7c717f5-275c-4276-beef-8bb8e0322ad2	t
767d9b8d-d1e0-46e8-8336-872e7ee443dd	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7	t
767d9b8d-d1e0-46e8-8336-872e7ee443dd	5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81	t
767d9b8d-d1e0-46e8-8336-872e7ee443dd	9fc9c2dc-e827-4104-a13f-3d2c84191815	f
767d9b8d-d1e0-46e8-8336-872e7ee443dd	865ea21d-5993-4a7f-ad32-27db092d5270	f
767d9b8d-d1e0-46e8-8336-872e7ee443dd	460b8e49-93f3-40a9-b2b9-974a31ef9adf	t
767d9b8d-d1e0-46e8-8336-872e7ee443dd	9bf3ba39-3566-4bd5-b772-0214d0d50487	t
767d9b8d-d1e0-46e8-8336-872e7ee443dd	09bb941f-dcd2-4bad-8bb8-33e32d7c2405	f
767d9b8d-d1e0-46e8-8336-872e7ee443dd	2d9c822f-439e-43e3-acf4-feb12d41f606	t
44e4f427-7bb6-413b-a887-fff03fedb6fb	5c424a01-bc01-4622-ba8d-98f7e49e9abe	f
44e4f427-7bb6-413b-a887-fff03fedb6fb	bb85d268-4c5c-42cc-8c30-e74aab503dc3	t
44e4f427-7bb6-413b-a887-fff03fedb6fb	56b7f4f2-31cd-41d3-9a4a-449211e08bdd	t
44e4f427-7bb6-413b-a887-fff03fedb6fb	569ebbed-a4f4-4171-9ed1-55ff385ee9e6	t
44e4f427-7bb6-413b-a887-fff03fedb6fb	0ce56349-3652-41a7-8d34-f29522d85dc6	f
44e4f427-7bb6-413b-a887-fff03fedb6fb	75b7693b-3901-4fda-8a48-6a116612dab4	f
44e4f427-7bb6-413b-a887-fff03fedb6fb	deddb0fa-5233-4c6f-b07d-a2d7985f40c3	t
44e4f427-7bb6-413b-a887-fff03fedb6fb	26b3ff50-189f-4569-ae85-07e3bd6b4da5	t
44e4f427-7bb6-413b-a887-fff03fedb6fb	681d3e9c-bf34-4475-8fee-5693e3cb2409	f
44e4f427-7bb6-413b-a887-fff03fedb6fb	c8c45953-cf67-44e6-a79a-7dfebd00b2fe	t
\.


--
-- Data for Name: event_entity; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.event_entity (id, client_id, details_json, error, ip_address, realm_id, session_id, event_time, type, user_id, details_json_long_value) FROM stdin;
\.


--
-- Data for Name: fed_user_attribute; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.fed_user_attribute (id, name, user_id, realm_id, storage_provider_id, value, long_value_hash, long_value_hash_lower_case, long_value) FROM stdin;
\.


--
-- Data for Name: fed_user_consent; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.fed_user_consent (id, client_id, user_id, realm_id, storage_provider_id, created_date, last_updated_date, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- Data for Name: fed_user_consent_cl_scope; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.fed_user_consent_cl_scope (user_consent_id, scope_id) FROM stdin;
\.


--
-- Data for Name: fed_user_credential; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.fed_user_credential (id, salt, type, created_date, user_id, realm_id, storage_provider_id, user_label, secret_data, credential_data, priority) FROM stdin;
\.


--
-- Data for Name: fed_user_group_membership; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.fed_user_group_membership (group_id, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: fed_user_required_action; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.fed_user_required_action (required_action, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: fed_user_role_mapping; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.fed_user_role_mapping (role_id, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: federated_identity; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.federated_identity (identity_provider, realm_id, federated_user_id, federated_username, token, user_id) FROM stdin;
\.


--
-- Data for Name: federated_user; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.federated_user (id, storage_provider_id, realm_id) FROM stdin;
\.


--
-- Data for Name: group_attribute; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.group_attribute (id, name, value, group_id) FROM stdin;
\.


--
-- Data for Name: group_role_mapping; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.group_role_mapping (role_id, group_id) FROM stdin;
\.


--
-- Data for Name: identity_provider; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.identity_provider (internal_id, enabled, provider_alias, provider_id, store_token, authenticate_by_default, realm_id, add_token_role, trust_email, first_broker_login_flow_id, post_broker_login_flow_id, provider_display_name, link_only) FROM stdin;
\.


--
-- Data for Name: identity_provider_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.identity_provider_config (identity_provider_id, value, name) FROM stdin;
\.


--
-- Data for Name: identity_provider_mapper; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.identity_provider_mapper (id, name, idp_alias, idp_mapper_name, realm_id) FROM stdin;
\.


--
-- Data for Name: idp_mapper_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.idp_mapper_config (idp_mapper_id, value, name) FROM stdin;
\.


--
-- Data for Name: keycloak_group; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.keycloak_group (id, name, parent_group, realm_id) FROM stdin;
\.


--
-- Data for Name: keycloak_role; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.keycloak_role (id, client_realm_constraint, client_role, description, name, realm_id, client, realm) FROM stdin;
cede3fb9-55db-49b4-a1ab-e107fd07dc5a	767d9b8d-d1e0-46e8-8336-872e7ee443dd	f	${role_default-roles}	default-roles-master	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N	\N
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	767d9b8d-d1e0-46e8-8336-872e7ee443dd	f	${role_admin}	admin	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N	\N
576695fb-214c-46fb-920a-5f37daccd8db	767d9b8d-d1e0-46e8-8336-872e7ee443dd	f	${role_create-realm}	create-realm	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N	\N
4a113f85-5fef-441b-b9fc-e9e274176d68	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_create-client}	create-client	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
fead0a36-0ac3-45c9-8dd5-4c46fc821e5b	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_view-realm}	view-realm	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
dc2de297-3b8e-4ffd-a880-8c9b1a6257a8	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_view-users}	view-users	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
f365b4ce-2639-4f36-8360-4e4bf1893736	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_view-clients}	view-clients	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
2d16f16e-a30d-48c1-b543-28e3cef5ea64	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_view-events}	view-events	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
b997a6f3-72b8-4a3d-b638-c1c9f1340d07	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_view-identity-providers}	view-identity-providers	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
3fdf4e0f-4d93-4962-bbf5-2ada51626463	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_view-authorization}	view-authorization	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
8833c6b0-ad0b-4f81-be0a-f40c36cda8fd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_manage-realm}	manage-realm	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
ee457df1-997d-4007-a91f-68f606b76802	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_manage-users}	manage-users	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
f80e1181-0306-4dfe-91a6-6c2ada6a7013	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_manage-clients}	manage-clients	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
152d8406-23ba-48d9-b26b-c59d471bfd8a	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_manage-events}	manage-events	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
381d870b-aeb0-444f-8294-5e24ad05c049	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_manage-identity-providers}	manage-identity-providers	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
1496f35b-23cb-4df8-a7a7-5dd0ab9deb54	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_manage-authorization}	manage-authorization	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
bf942e68-e846-479d-ab68-6920f2b89a14	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_query-users}	query-users	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
cc914a24-45b0-4b47-bc25-50eda3b6205b	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_query-clients}	query-clients	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
1cdecf67-791e-4486-82df-fd4d73e95e9e	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_query-realms}	query-realms	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
b8657608-3715-456a-a893-067c084a3685	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_query-groups}	query-groups	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
a7832ee9-77ca-499a-97c3-a77907495d57	a1142b95-e1b3-4555-8c77-795b329fd5f8	t	${role_view-profile}	view-profile	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a1142b95-e1b3-4555-8c77-795b329fd5f8	\N
b96ee64d-e253-423d-ba83-74f97ac4c3c9	a1142b95-e1b3-4555-8c77-795b329fd5f8	t	${role_manage-account}	manage-account	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a1142b95-e1b3-4555-8c77-795b329fd5f8	\N
d493680e-317f-4f53-bf44-f690880e7068	a1142b95-e1b3-4555-8c77-795b329fd5f8	t	${role_manage-account-links}	manage-account-links	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a1142b95-e1b3-4555-8c77-795b329fd5f8	\N
9d4ff15b-004d-4bf8-a3de-307243e10ca8	a1142b95-e1b3-4555-8c77-795b329fd5f8	t	${role_view-applications}	view-applications	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a1142b95-e1b3-4555-8c77-795b329fd5f8	\N
dcee6162-9793-4730-9042-1f09a12b3442	a1142b95-e1b3-4555-8c77-795b329fd5f8	t	${role_view-consent}	view-consent	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a1142b95-e1b3-4555-8c77-795b329fd5f8	\N
ae71d77a-88db-4339-b282-65b25c88cc11	a1142b95-e1b3-4555-8c77-795b329fd5f8	t	${role_manage-consent}	manage-consent	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a1142b95-e1b3-4555-8c77-795b329fd5f8	\N
3e7aa68c-3e39-40fe-add5-feea461c5b2b	a1142b95-e1b3-4555-8c77-795b329fd5f8	t	${role_view-groups}	view-groups	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a1142b95-e1b3-4555-8c77-795b329fd5f8	\N
4693d4d2-d601-4d3d-9eb7-511fc4d0b44a	a1142b95-e1b3-4555-8c77-795b329fd5f8	t	${role_delete-account}	delete-account	767d9b8d-d1e0-46e8-8336-872e7ee443dd	a1142b95-e1b3-4555-8c77-795b329fd5f8	\N
f4fb053c-6b8e-471d-8ff6-84c4bcb0042e	cf8c636a-969c-4676-a664-99f5bcef27c3	t	${role_read-token}	read-token	767d9b8d-d1e0-46e8-8336-872e7ee443dd	cf8c636a-969c-4676-a664-99f5bcef27c3	\N
9e671124-9283-440e-b033-78ea9bbd9dbd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	t	${role_impersonation}	impersonation	767d9b8d-d1e0-46e8-8336-872e7ee443dd	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	\N
55cab3c6-7f3a-40f6-a08e-26b93a97e44c	767d9b8d-d1e0-46e8-8336-872e7ee443dd	f	${role_offline-access}	offline_access	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N	\N
e94135e9-92a3-4602-8702-a617e18c9c1c	767d9b8d-d1e0-46e8-8336-872e7ee443dd	f	${role_uma_authorization}	uma_authorization	767d9b8d-d1e0-46e8-8336-872e7ee443dd	\N	\N
04ac6b5d-9ff9-4db2-b2e1-f0e20c3d3152	44e4f427-7bb6-413b-a887-fff03fedb6fb	f	${role_default-roles}	default-roles-measuremanager	44e4f427-7bb6-413b-a887-fff03fedb6fb	\N	\N
241518f2-7833-4787-b9ab-91c5e4506137	e000e9f7-279c-4b44-9292-350a83cf8059	t	${role_create-client}	create-client	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e000e9f7-279c-4b44-9292-350a83cf8059	\N
1ad95ac4-b903-41b6-a501-5107b94aca0e	e000e9f7-279c-4b44-9292-350a83cf8059	t	${role_view-realm}	view-realm	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e000e9f7-279c-4b44-9292-350a83cf8059	\N
c8ee5ce7-48c6-4f90-bf39-fd05696fbb58	e000e9f7-279c-4b44-9292-350a83cf8059	t	${role_view-users}	view-users	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e000e9f7-279c-4b44-9292-350a83cf8059	\N
1fb6b3e9-0cf3-41f2-b20c-b9adb9c6099d	e000e9f7-279c-4b44-9292-350a83cf8059	t	${role_view-clients}	view-clients	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e000e9f7-279c-4b44-9292-350a83cf8059	\N
e208c4f0-2621-4d0c-8255-9b5bacfcbb7f	e000e9f7-279c-4b44-9292-350a83cf8059	t	${role_view-events}	view-events	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e000e9f7-279c-4b44-9292-350a83cf8059	\N
39e5273b-84c6-4036-8bea-8c1a19e333c4	e000e9f7-279c-4b44-9292-350a83cf8059	t	${role_view-identity-providers}	view-identity-providers	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e000e9f7-279c-4b44-9292-350a83cf8059	\N
90d43c43-9a56-418f-913a-2d8338b71bba	e000e9f7-279c-4b44-9292-350a83cf8059	t	${role_view-authorization}	view-authorization	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e000e9f7-279c-4b44-9292-350a83cf8059	\N
97666f7d-c39e-48fc-b9f0-f10c1b39e9b5	e000e9f7-279c-4b44-9292-350a83cf8059	t	${role_manage-realm}	manage-realm	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e000e9f7-279c-4b44-9292-350a83cf8059	\N
2a6b71a9-f62f-4be9-96f6-483cd04b4dd9	e000e9f7-279c-4b44-9292-350a83cf8059	t	${role_manage-users}	manage-users	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e000e9f7-279c-4b44-9292-350a83cf8059	\N
6bf338fa-76c7-41e6-ae8e-5b497e41c651	e000e9f7-279c-4b44-9292-350a83cf8059	t	${role_manage-clients}	manage-clients	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e000e9f7-279c-4b44-9292-350a83cf8059	\N
250ebd74-74ae-4230-91d8-8f68bd2369ac	e000e9f7-279c-4b44-9292-350a83cf8059	t	${role_manage-events}	manage-events	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e000e9f7-279c-4b44-9292-350a83cf8059	\N
29685447-f932-4dba-b382-797b974fde89	e000e9f7-279c-4b44-9292-350a83cf8059	t	${role_manage-identity-providers}	manage-identity-providers	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e000e9f7-279c-4b44-9292-350a83cf8059	\N
5b13cf67-2cca-4795-9f92-8e0c56a6a167	e000e9f7-279c-4b44-9292-350a83cf8059	t	${role_manage-authorization}	manage-authorization	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e000e9f7-279c-4b44-9292-350a83cf8059	\N
27f60849-2057-4b4d-80d7-91b147707880	e000e9f7-279c-4b44-9292-350a83cf8059	t	${role_query-users}	query-users	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e000e9f7-279c-4b44-9292-350a83cf8059	\N
5cbb362f-b55b-43ac-b3fd-a78ac7b096d9	e000e9f7-279c-4b44-9292-350a83cf8059	t	${role_query-clients}	query-clients	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e000e9f7-279c-4b44-9292-350a83cf8059	\N
81ed6a28-0575-463e-b063-a5b60fe881c1	e000e9f7-279c-4b44-9292-350a83cf8059	t	${role_query-realms}	query-realms	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e000e9f7-279c-4b44-9292-350a83cf8059	\N
096af03b-cebd-4661-8447-98a1e2320e20	e000e9f7-279c-4b44-9292-350a83cf8059	t	${role_query-groups}	query-groups	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e000e9f7-279c-4b44-9292-350a83cf8059	\N
22527c7c-af82-4146-bb98-3b91a3338657	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	${role_realm-admin}	realm-admin	44e4f427-7bb6-413b-a887-fff03fedb6fb	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	\N
e251a6fe-bba4-420c-9195-4e1301a1d686	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	${role_create-client}	create-client	44e4f427-7bb6-413b-a887-fff03fedb6fb	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	\N
2098e727-0f3e-4847-82d7-551fa64d1960	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	${role_view-realm}	view-realm	44e4f427-7bb6-413b-a887-fff03fedb6fb	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	\N
30e56bbd-d0f3-4a20-a12c-2b57de0e9a7f	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	${role_view-users}	view-users	44e4f427-7bb6-413b-a887-fff03fedb6fb	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	\N
548712bc-a979-458d-9967-c97089552f7f	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	${role_view-clients}	view-clients	44e4f427-7bb6-413b-a887-fff03fedb6fb	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	\N
aa74337f-bec8-4ae9-8845-9008b48db535	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	${role_view-events}	view-events	44e4f427-7bb6-413b-a887-fff03fedb6fb	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	\N
0fdfe4a5-df5f-4fef-8302-0149068cd62a	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	${role_view-identity-providers}	view-identity-providers	44e4f427-7bb6-413b-a887-fff03fedb6fb	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	\N
df324fdc-1d82-4193-9a26-15eb51da19fa	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	${role_view-authorization}	view-authorization	44e4f427-7bb6-413b-a887-fff03fedb6fb	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	\N
e9ffc1a4-4baa-4ae5-b4b4-c7867be56984	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	${role_manage-realm}	manage-realm	44e4f427-7bb6-413b-a887-fff03fedb6fb	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	\N
50aa573a-7f03-4a91-91ba-b65a2c3b4bf8	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	${role_manage-users}	manage-users	44e4f427-7bb6-413b-a887-fff03fedb6fb	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	\N
e53375ea-09af-4a4e-b793-c38412ce74ad	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	${role_manage-clients}	manage-clients	44e4f427-7bb6-413b-a887-fff03fedb6fb	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	\N
6c91c39e-b953-4836-b61d-7031f8f6f0e7	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	${role_manage-events}	manage-events	44e4f427-7bb6-413b-a887-fff03fedb6fb	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	\N
e0e09cd6-d042-4505-ad1d-7d3aea4e44f4	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	${role_manage-identity-providers}	manage-identity-providers	44e4f427-7bb6-413b-a887-fff03fedb6fb	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	\N
46aca8eb-78bb-45e9-928b-67ec70e18fe4	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	${role_manage-authorization}	manage-authorization	44e4f427-7bb6-413b-a887-fff03fedb6fb	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	\N
d1afcb18-4e7c-49a7-af3c-2e910a90889a	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	${role_query-users}	query-users	44e4f427-7bb6-413b-a887-fff03fedb6fb	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	\N
5bc489b9-8cf7-4b50-aabc-e1f10db6f683	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	${role_query-clients}	query-clients	44e4f427-7bb6-413b-a887-fff03fedb6fb	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	\N
f5c214cb-ccad-495c-934e-44e040937a66	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	${role_query-realms}	query-realms	44e4f427-7bb6-413b-a887-fff03fedb6fb	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	\N
04bd5c21-6868-4ec6-b2f9-b7670d7eaaab	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	${role_query-groups}	query-groups	44e4f427-7bb6-413b-a887-fff03fedb6fb	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	\N
55c359ef-bc71-41d4-a156-94408f04dba6	79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	t	${role_view-profile}	view-profile	44e4f427-7bb6-413b-a887-fff03fedb6fb	79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	\N
345e2a60-6d0d-4335-9b46-a0ec4a92d65a	79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	t	${role_manage-account}	manage-account	44e4f427-7bb6-413b-a887-fff03fedb6fb	79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	\N
bd693411-57cd-4f15-8a7b-52bb50ca99c7	79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	t	${role_manage-account-links}	manage-account-links	44e4f427-7bb6-413b-a887-fff03fedb6fb	79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	\N
cb89dfcc-df68-425b-864b-97ca898cc706	79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	t	${role_view-applications}	view-applications	44e4f427-7bb6-413b-a887-fff03fedb6fb	79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	\N
63df746a-58c6-4b44-b194-06cebcc82731	79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	t	${role_view-consent}	view-consent	44e4f427-7bb6-413b-a887-fff03fedb6fb	79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	\N
59df52b6-3fc3-4625-ab0e-47ae892958ad	79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	t	${role_manage-consent}	manage-consent	44e4f427-7bb6-413b-a887-fff03fedb6fb	79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	\N
146fa3ee-ac48-4617-a14b-805f78c5c33d	79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	t	${role_view-groups}	view-groups	44e4f427-7bb6-413b-a887-fff03fedb6fb	79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	\N
29e04d09-bde1-423a-9ff9-ffc93814ea92	79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	t	${role_delete-account}	delete-account	44e4f427-7bb6-413b-a887-fff03fedb6fb	79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	\N
6e97c191-8c67-4f9d-b297-223c8fb9a3a2	e000e9f7-279c-4b44-9292-350a83cf8059	t	${role_impersonation}	impersonation	767d9b8d-d1e0-46e8-8336-872e7ee443dd	e000e9f7-279c-4b44-9292-350a83cf8059	\N
306a7ae3-acd1-40d4-9b66-e74365e1347d	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	t	${role_impersonation}	impersonation	44e4f427-7bb6-413b-a887-fff03fedb6fb	e37f7a82-6d4f-4c47-9304-87eaf696d4c2	\N
d45c8e31-7702-4f65-ac2e-07e551950a25	3acaef89-0228-40fc-abf9-d0c662da3427	t	${role_read-token}	read-token	44e4f427-7bb6-413b-a887-fff03fedb6fb	3acaef89-0228-40fc-abf9-d0c662da3427	\N
ede82158-5112-476f-afad-c8a8b58d24b2	44e4f427-7bb6-413b-a887-fff03fedb6fb	f	${role_offline-access}	offline_access	44e4f427-7bb6-413b-a887-fff03fedb6fb	\N	\N
af9a46ac-161c-4fcf-8c43-32dccb979b91	44e4f427-7bb6-413b-a887-fff03fedb6fb	f	${role_uma_authorization}	uma_authorization	44e4f427-7bb6-413b-a887-fff03fedb6fb	\N	\N
\.


--
-- Data for Name: migration_model; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.migration_model (id, version, update_time) FROM stdin;
7mn31	24.0.5	1740481499
\.


--
-- Data for Name: offline_client_session; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.offline_client_session (user_session_id, client_id, offline_flag, "timestamp", data, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- Data for Name: offline_user_session; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.offline_user_session (user_session_id, user_id, realm_id, created_on, offline_flag, data, last_session_refresh) FROM stdin;
\.


--
-- Data for Name: policy_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.policy_config (policy_id, name, value) FROM stdin;
\.


--
-- Data for Name: protocol_mapper; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.protocol_mapper (id, name, protocol, protocol_mapper_name, client_id, client_scope_id) FROM stdin;
33c234ce-9593-4e34-8037-cac0b4f550cb	audience resolve	openid-connect	oidc-audience-resolve-mapper	21f5e158-9ae0-47eb-a8af-5e5413d0f224	\N
00452457-42c0-470d-be15-1da6807a158b	locale	openid-connect	oidc-usermodel-attribute-mapper	fec6b05c-1521-42c8-b5eb-e83a00d28125	\N
134fdb66-4e00-4baa-b641-0f0066b7c7eb	role list	saml	saml-role-list-mapper	\N	a7c717f5-275c-4276-beef-8bb8e0322ad2
3f8180d1-80f8-4735-b5ab-30345bc6a55b	full name	openid-connect	oidc-full-name-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
d4dfb855-8cb3-4308-95d3-a82ff7a87551	family name	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
113d0a02-b221-464f-9e41-d6f3f8a79b93	given name	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
15005cbd-8493-4861-a3d0-e554f993df32	middle name	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
cdb940a6-e606-4f37-a5d5-89c8e5bfe91e	nickname	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
1690b67b-703f-42be-bd7d-fa9906034b50	username	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
68068ab6-59c2-4c14-b400-16c9b85a4a98	profile	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
a70468af-db28-4313-b670-4b930b76849b	picture	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
5caeac20-24e2-4a79-925c-f3c72273e2ec	website	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
29937222-642e-42b2-b82a-3ffd7c78ecf1	gender	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
08829d89-686e-41f7-823b-f9279dd3ee53	birthdate	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
f3ecabfc-0eeb-4319-ab97-b6a49b0620da	zoneinfo	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
8ab7e91a-b3bc-4180-9b7b-dd8e1796f06e	locale	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
2182a3d9-9e21-43bb-b4a6-728b38bec64e	updated at	openid-connect	oidc-usermodel-attribute-mapper	\N	c5937a9d-7fe2-41a6-bfba-373e0fdefcd7
c4bd154a-a2d6-4888-af25-ade3316d6107	email	openid-connect	oidc-usermodel-attribute-mapper	\N	5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81
14b19528-41bd-46f6-aa1c-edc8c43150d8	email verified	openid-connect	oidc-usermodel-property-mapper	\N	5ac8a7f7-23f9-4bf6-b3f7-b9a8271b9a81
385e8a4f-a2aa-4231-9bab-dd18d9150083	address	openid-connect	oidc-address-mapper	\N	9fc9c2dc-e827-4104-a13f-3d2c84191815
56a12d7d-4891-48a5-b23d-195b558b8828	phone number	openid-connect	oidc-usermodel-attribute-mapper	\N	865ea21d-5993-4a7f-ad32-27db092d5270
8af9bfb7-caf4-454b-840b-0f5f2760968c	phone number verified	openid-connect	oidc-usermodel-attribute-mapper	\N	865ea21d-5993-4a7f-ad32-27db092d5270
3ee8f1f6-08fe-4821-8f09-02a22a065b57	realm roles	openid-connect	oidc-usermodel-realm-role-mapper	\N	460b8e49-93f3-40a9-b2b9-974a31ef9adf
abea88c9-f648-4395-97e1-46dfe8ec8faa	client roles	openid-connect	oidc-usermodel-client-role-mapper	\N	460b8e49-93f3-40a9-b2b9-974a31ef9adf
5469604c-e44f-4181-8c10-88e9d7ac6209	audience resolve	openid-connect	oidc-audience-resolve-mapper	\N	460b8e49-93f3-40a9-b2b9-974a31ef9adf
a7b67101-57b6-46f6-a7ee-0c2083718da9	allowed web origins	openid-connect	oidc-allowed-origins-mapper	\N	9bf3ba39-3566-4bd5-b772-0214d0d50487
c69b107d-b5ef-4712-80c6-1cae2f5e21c0	upn	openid-connect	oidc-usermodel-attribute-mapper	\N	09bb941f-dcd2-4bad-8bb8-33e32d7c2405
ade61f00-8330-4bdd-b393-ca139d5127ff	groups	openid-connect	oidc-usermodel-realm-role-mapper	\N	09bb941f-dcd2-4bad-8bb8-33e32d7c2405
e5483c66-b7e9-4b1d-86e0-08ca579c73d0	acr loa level	openid-connect	oidc-acr-mapper	\N	2d9c822f-439e-43e3-acf4-feb12d41f606
1fc8c467-6474-439f-804d-04279ad80fbc	audience resolve	openid-connect	oidc-audience-resolve-mapper	da4d4a95-8670-4686-9786-f6b581ed61ba	\N
73f6da32-093d-474a-bce6-ce960d8b62e1	role list	saml	saml-role-list-mapper	\N	bb85d268-4c5c-42cc-8c30-e74aab503dc3
1d3b66fb-4fe7-4b2f-a74a-2aba117b3899	full name	openid-connect	oidc-full-name-mapper	\N	56b7f4f2-31cd-41d3-9a4a-449211e08bdd
682ca6f8-d482-4226-bdb8-52453c4c1c7a	family name	openid-connect	oidc-usermodel-attribute-mapper	\N	56b7f4f2-31cd-41d3-9a4a-449211e08bdd
405f5a6f-e05c-457e-b091-050b130672a1	given name	openid-connect	oidc-usermodel-attribute-mapper	\N	56b7f4f2-31cd-41d3-9a4a-449211e08bdd
4183f298-aa7f-40d8-9bd6-68d7e7d09830	middle name	openid-connect	oidc-usermodel-attribute-mapper	\N	56b7f4f2-31cd-41d3-9a4a-449211e08bdd
4c9c582d-9e68-4c99-b1bf-13790c5ed009	nickname	openid-connect	oidc-usermodel-attribute-mapper	\N	56b7f4f2-31cd-41d3-9a4a-449211e08bdd
b7644ec1-9a5e-49c5-84b6-e23bfd7db737	username	openid-connect	oidc-usermodel-attribute-mapper	\N	56b7f4f2-31cd-41d3-9a4a-449211e08bdd
6366159e-375f-4ef3-a1f9-621ba80d389a	profile	openid-connect	oidc-usermodel-attribute-mapper	\N	56b7f4f2-31cd-41d3-9a4a-449211e08bdd
8dd04f02-c349-4199-a81d-8ea1615b1255	picture	openid-connect	oidc-usermodel-attribute-mapper	\N	56b7f4f2-31cd-41d3-9a4a-449211e08bdd
862be9b5-0c17-41c6-be1b-98a688363e73	website	openid-connect	oidc-usermodel-attribute-mapper	\N	56b7f4f2-31cd-41d3-9a4a-449211e08bdd
c9d999b1-c1da-4c32-8418-561f28e457c1	gender	openid-connect	oidc-usermodel-attribute-mapper	\N	56b7f4f2-31cd-41d3-9a4a-449211e08bdd
03d6ffef-1452-4fef-86dc-22c6512fd0b1	birthdate	openid-connect	oidc-usermodel-attribute-mapper	\N	56b7f4f2-31cd-41d3-9a4a-449211e08bdd
d2272714-a8c2-4e04-ba13-9e0c18c1e3a1	zoneinfo	openid-connect	oidc-usermodel-attribute-mapper	\N	56b7f4f2-31cd-41d3-9a4a-449211e08bdd
65735626-0600-4eb9-b447-ee626e6e0e53	locale	openid-connect	oidc-usermodel-attribute-mapper	\N	56b7f4f2-31cd-41d3-9a4a-449211e08bdd
e0897524-705e-47e2-8e34-0b346be2df7e	updated at	openid-connect	oidc-usermodel-attribute-mapper	\N	56b7f4f2-31cd-41d3-9a4a-449211e08bdd
dd87f6e7-b019-4c66-b9a1-48e7f7ca66cf	email	openid-connect	oidc-usermodel-attribute-mapper	\N	569ebbed-a4f4-4171-9ed1-55ff385ee9e6
8a9ed477-304d-4e34-81bc-7192763b7d17	email verified	openid-connect	oidc-usermodel-property-mapper	\N	569ebbed-a4f4-4171-9ed1-55ff385ee9e6
72a59054-606b-412e-8fe2-13d053526221	address	openid-connect	oidc-address-mapper	\N	0ce56349-3652-41a7-8d34-f29522d85dc6
9b0fca62-d62e-40f2-85de-b52463b2fa22	phone number	openid-connect	oidc-usermodel-attribute-mapper	\N	75b7693b-3901-4fda-8a48-6a116612dab4
2f840528-a0a9-493e-a57f-5373c1af2356	phone number verified	openid-connect	oidc-usermodel-attribute-mapper	\N	75b7693b-3901-4fda-8a48-6a116612dab4
54ef6a5a-d856-4197-b5ba-4dc6a2f70c2a	realm roles	openid-connect	oidc-usermodel-realm-role-mapper	\N	deddb0fa-5233-4c6f-b07d-a2d7985f40c3
7990677b-53f5-4205-8d0a-6c192e5629ff	client roles	openid-connect	oidc-usermodel-client-role-mapper	\N	deddb0fa-5233-4c6f-b07d-a2d7985f40c3
7ee80334-995d-4eb3-94ce-81b2cf3bef88	audience resolve	openid-connect	oidc-audience-resolve-mapper	\N	deddb0fa-5233-4c6f-b07d-a2d7985f40c3
243c9a9d-393f-4332-95df-0ae7bd1b7289	allowed web origins	openid-connect	oidc-allowed-origins-mapper	\N	26b3ff50-189f-4569-ae85-07e3bd6b4da5
a357e500-3da4-49e9-9deb-b1ce838e4868	upn	openid-connect	oidc-usermodel-attribute-mapper	\N	681d3e9c-bf34-4475-8fee-5693e3cb2409
0388a318-42b1-4938-8bd9-24aa8364ba75	groups	openid-connect	oidc-usermodel-realm-role-mapper	\N	681d3e9c-bf34-4475-8fee-5693e3cb2409
183158de-bcf8-4429-9d73-2ad7d81edef7	acr loa level	openid-connect	oidc-acr-mapper	\N	c8c45953-cf67-44e6-a79a-7dfebd00b2fe
311b5937-3a69-452d-9391-160c4d5a994c	locale	openid-connect	oidc-usermodel-attribute-mapper	b593bc14-7f70-4926-824b-644aa02f48f8	\N
\.


--
-- Data for Name: protocol_mapper_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.protocol_mapper_config (protocol_mapper_id, value, name) FROM stdin;
00452457-42c0-470d-be15-1da6807a158b	true	introspection.token.claim
00452457-42c0-470d-be15-1da6807a158b	true	userinfo.token.claim
00452457-42c0-470d-be15-1da6807a158b	locale	user.attribute
00452457-42c0-470d-be15-1da6807a158b	true	id.token.claim
00452457-42c0-470d-be15-1da6807a158b	true	access.token.claim
00452457-42c0-470d-be15-1da6807a158b	locale	claim.name
00452457-42c0-470d-be15-1da6807a158b	String	jsonType.label
134fdb66-4e00-4baa-b641-0f0066b7c7eb	false	single
134fdb66-4e00-4baa-b641-0f0066b7c7eb	Basic	attribute.nameformat
134fdb66-4e00-4baa-b641-0f0066b7c7eb	Role	attribute.name
08829d89-686e-41f7-823b-f9279dd3ee53	true	introspection.token.claim
08829d89-686e-41f7-823b-f9279dd3ee53	true	userinfo.token.claim
08829d89-686e-41f7-823b-f9279dd3ee53	birthdate	user.attribute
08829d89-686e-41f7-823b-f9279dd3ee53	true	id.token.claim
08829d89-686e-41f7-823b-f9279dd3ee53	true	access.token.claim
08829d89-686e-41f7-823b-f9279dd3ee53	birthdate	claim.name
08829d89-686e-41f7-823b-f9279dd3ee53	String	jsonType.label
113d0a02-b221-464f-9e41-d6f3f8a79b93	true	introspection.token.claim
113d0a02-b221-464f-9e41-d6f3f8a79b93	true	userinfo.token.claim
113d0a02-b221-464f-9e41-d6f3f8a79b93	firstName	user.attribute
113d0a02-b221-464f-9e41-d6f3f8a79b93	true	id.token.claim
113d0a02-b221-464f-9e41-d6f3f8a79b93	true	access.token.claim
113d0a02-b221-464f-9e41-d6f3f8a79b93	given_name	claim.name
113d0a02-b221-464f-9e41-d6f3f8a79b93	String	jsonType.label
15005cbd-8493-4861-a3d0-e554f993df32	true	introspection.token.claim
15005cbd-8493-4861-a3d0-e554f993df32	true	userinfo.token.claim
15005cbd-8493-4861-a3d0-e554f993df32	middleName	user.attribute
15005cbd-8493-4861-a3d0-e554f993df32	true	id.token.claim
15005cbd-8493-4861-a3d0-e554f993df32	true	access.token.claim
15005cbd-8493-4861-a3d0-e554f993df32	middle_name	claim.name
15005cbd-8493-4861-a3d0-e554f993df32	String	jsonType.label
1690b67b-703f-42be-bd7d-fa9906034b50	true	introspection.token.claim
1690b67b-703f-42be-bd7d-fa9906034b50	true	userinfo.token.claim
1690b67b-703f-42be-bd7d-fa9906034b50	username	user.attribute
1690b67b-703f-42be-bd7d-fa9906034b50	true	id.token.claim
1690b67b-703f-42be-bd7d-fa9906034b50	true	access.token.claim
1690b67b-703f-42be-bd7d-fa9906034b50	preferred_username	claim.name
1690b67b-703f-42be-bd7d-fa9906034b50	String	jsonType.label
2182a3d9-9e21-43bb-b4a6-728b38bec64e	true	introspection.token.claim
2182a3d9-9e21-43bb-b4a6-728b38bec64e	true	userinfo.token.claim
2182a3d9-9e21-43bb-b4a6-728b38bec64e	updatedAt	user.attribute
2182a3d9-9e21-43bb-b4a6-728b38bec64e	true	id.token.claim
2182a3d9-9e21-43bb-b4a6-728b38bec64e	true	access.token.claim
2182a3d9-9e21-43bb-b4a6-728b38bec64e	updated_at	claim.name
2182a3d9-9e21-43bb-b4a6-728b38bec64e	long	jsonType.label
29937222-642e-42b2-b82a-3ffd7c78ecf1	true	introspection.token.claim
29937222-642e-42b2-b82a-3ffd7c78ecf1	true	userinfo.token.claim
29937222-642e-42b2-b82a-3ffd7c78ecf1	gender	user.attribute
29937222-642e-42b2-b82a-3ffd7c78ecf1	true	id.token.claim
29937222-642e-42b2-b82a-3ffd7c78ecf1	true	access.token.claim
29937222-642e-42b2-b82a-3ffd7c78ecf1	gender	claim.name
29937222-642e-42b2-b82a-3ffd7c78ecf1	String	jsonType.label
3f8180d1-80f8-4735-b5ab-30345bc6a55b	true	introspection.token.claim
3f8180d1-80f8-4735-b5ab-30345bc6a55b	true	userinfo.token.claim
3f8180d1-80f8-4735-b5ab-30345bc6a55b	true	id.token.claim
3f8180d1-80f8-4735-b5ab-30345bc6a55b	true	access.token.claim
5caeac20-24e2-4a79-925c-f3c72273e2ec	true	introspection.token.claim
5caeac20-24e2-4a79-925c-f3c72273e2ec	true	userinfo.token.claim
5caeac20-24e2-4a79-925c-f3c72273e2ec	website	user.attribute
5caeac20-24e2-4a79-925c-f3c72273e2ec	true	id.token.claim
5caeac20-24e2-4a79-925c-f3c72273e2ec	true	access.token.claim
5caeac20-24e2-4a79-925c-f3c72273e2ec	website	claim.name
5caeac20-24e2-4a79-925c-f3c72273e2ec	String	jsonType.label
68068ab6-59c2-4c14-b400-16c9b85a4a98	true	introspection.token.claim
68068ab6-59c2-4c14-b400-16c9b85a4a98	true	userinfo.token.claim
68068ab6-59c2-4c14-b400-16c9b85a4a98	profile	user.attribute
68068ab6-59c2-4c14-b400-16c9b85a4a98	true	id.token.claim
68068ab6-59c2-4c14-b400-16c9b85a4a98	true	access.token.claim
68068ab6-59c2-4c14-b400-16c9b85a4a98	profile	claim.name
68068ab6-59c2-4c14-b400-16c9b85a4a98	String	jsonType.label
8ab7e91a-b3bc-4180-9b7b-dd8e1796f06e	true	introspection.token.claim
8ab7e91a-b3bc-4180-9b7b-dd8e1796f06e	true	userinfo.token.claim
8ab7e91a-b3bc-4180-9b7b-dd8e1796f06e	locale	user.attribute
8ab7e91a-b3bc-4180-9b7b-dd8e1796f06e	true	id.token.claim
8ab7e91a-b3bc-4180-9b7b-dd8e1796f06e	true	access.token.claim
8ab7e91a-b3bc-4180-9b7b-dd8e1796f06e	locale	claim.name
8ab7e91a-b3bc-4180-9b7b-dd8e1796f06e	String	jsonType.label
a70468af-db28-4313-b670-4b930b76849b	true	introspection.token.claim
a70468af-db28-4313-b670-4b930b76849b	true	userinfo.token.claim
a70468af-db28-4313-b670-4b930b76849b	picture	user.attribute
a70468af-db28-4313-b670-4b930b76849b	true	id.token.claim
a70468af-db28-4313-b670-4b930b76849b	true	access.token.claim
a70468af-db28-4313-b670-4b930b76849b	picture	claim.name
a70468af-db28-4313-b670-4b930b76849b	String	jsonType.label
cdb940a6-e606-4f37-a5d5-89c8e5bfe91e	true	introspection.token.claim
cdb940a6-e606-4f37-a5d5-89c8e5bfe91e	true	userinfo.token.claim
cdb940a6-e606-4f37-a5d5-89c8e5bfe91e	nickname	user.attribute
cdb940a6-e606-4f37-a5d5-89c8e5bfe91e	true	id.token.claim
cdb940a6-e606-4f37-a5d5-89c8e5bfe91e	true	access.token.claim
cdb940a6-e606-4f37-a5d5-89c8e5bfe91e	nickname	claim.name
cdb940a6-e606-4f37-a5d5-89c8e5bfe91e	String	jsonType.label
d4dfb855-8cb3-4308-95d3-a82ff7a87551	true	introspection.token.claim
d4dfb855-8cb3-4308-95d3-a82ff7a87551	true	userinfo.token.claim
d4dfb855-8cb3-4308-95d3-a82ff7a87551	lastName	user.attribute
d4dfb855-8cb3-4308-95d3-a82ff7a87551	true	id.token.claim
d4dfb855-8cb3-4308-95d3-a82ff7a87551	true	access.token.claim
d4dfb855-8cb3-4308-95d3-a82ff7a87551	family_name	claim.name
d4dfb855-8cb3-4308-95d3-a82ff7a87551	String	jsonType.label
f3ecabfc-0eeb-4319-ab97-b6a49b0620da	true	introspection.token.claim
f3ecabfc-0eeb-4319-ab97-b6a49b0620da	true	userinfo.token.claim
f3ecabfc-0eeb-4319-ab97-b6a49b0620da	zoneinfo	user.attribute
f3ecabfc-0eeb-4319-ab97-b6a49b0620da	true	id.token.claim
f3ecabfc-0eeb-4319-ab97-b6a49b0620da	true	access.token.claim
f3ecabfc-0eeb-4319-ab97-b6a49b0620da	zoneinfo	claim.name
f3ecabfc-0eeb-4319-ab97-b6a49b0620da	String	jsonType.label
14b19528-41bd-46f6-aa1c-edc8c43150d8	true	introspection.token.claim
14b19528-41bd-46f6-aa1c-edc8c43150d8	true	userinfo.token.claim
14b19528-41bd-46f6-aa1c-edc8c43150d8	emailVerified	user.attribute
14b19528-41bd-46f6-aa1c-edc8c43150d8	true	id.token.claim
14b19528-41bd-46f6-aa1c-edc8c43150d8	true	access.token.claim
14b19528-41bd-46f6-aa1c-edc8c43150d8	email_verified	claim.name
14b19528-41bd-46f6-aa1c-edc8c43150d8	boolean	jsonType.label
c4bd154a-a2d6-4888-af25-ade3316d6107	true	introspection.token.claim
c4bd154a-a2d6-4888-af25-ade3316d6107	true	userinfo.token.claim
c4bd154a-a2d6-4888-af25-ade3316d6107	email	user.attribute
c4bd154a-a2d6-4888-af25-ade3316d6107	true	id.token.claim
c4bd154a-a2d6-4888-af25-ade3316d6107	true	access.token.claim
c4bd154a-a2d6-4888-af25-ade3316d6107	email	claim.name
c4bd154a-a2d6-4888-af25-ade3316d6107	String	jsonType.label
385e8a4f-a2aa-4231-9bab-dd18d9150083	formatted	user.attribute.formatted
385e8a4f-a2aa-4231-9bab-dd18d9150083	country	user.attribute.country
385e8a4f-a2aa-4231-9bab-dd18d9150083	true	introspection.token.claim
385e8a4f-a2aa-4231-9bab-dd18d9150083	postal_code	user.attribute.postal_code
385e8a4f-a2aa-4231-9bab-dd18d9150083	true	userinfo.token.claim
385e8a4f-a2aa-4231-9bab-dd18d9150083	street	user.attribute.street
385e8a4f-a2aa-4231-9bab-dd18d9150083	true	id.token.claim
385e8a4f-a2aa-4231-9bab-dd18d9150083	region	user.attribute.region
385e8a4f-a2aa-4231-9bab-dd18d9150083	true	access.token.claim
385e8a4f-a2aa-4231-9bab-dd18d9150083	locality	user.attribute.locality
56a12d7d-4891-48a5-b23d-195b558b8828	true	introspection.token.claim
56a12d7d-4891-48a5-b23d-195b558b8828	true	userinfo.token.claim
56a12d7d-4891-48a5-b23d-195b558b8828	phoneNumber	user.attribute
56a12d7d-4891-48a5-b23d-195b558b8828	true	id.token.claim
56a12d7d-4891-48a5-b23d-195b558b8828	true	access.token.claim
56a12d7d-4891-48a5-b23d-195b558b8828	phone_number	claim.name
56a12d7d-4891-48a5-b23d-195b558b8828	String	jsonType.label
8af9bfb7-caf4-454b-840b-0f5f2760968c	true	introspection.token.claim
8af9bfb7-caf4-454b-840b-0f5f2760968c	true	userinfo.token.claim
8af9bfb7-caf4-454b-840b-0f5f2760968c	phoneNumberVerified	user.attribute
8af9bfb7-caf4-454b-840b-0f5f2760968c	true	id.token.claim
8af9bfb7-caf4-454b-840b-0f5f2760968c	true	access.token.claim
8af9bfb7-caf4-454b-840b-0f5f2760968c	phone_number_verified	claim.name
8af9bfb7-caf4-454b-840b-0f5f2760968c	boolean	jsonType.label
3ee8f1f6-08fe-4821-8f09-02a22a065b57	true	introspection.token.claim
3ee8f1f6-08fe-4821-8f09-02a22a065b57	true	multivalued
3ee8f1f6-08fe-4821-8f09-02a22a065b57	foo	user.attribute
3ee8f1f6-08fe-4821-8f09-02a22a065b57	true	access.token.claim
3ee8f1f6-08fe-4821-8f09-02a22a065b57	realm_access.roles	claim.name
3ee8f1f6-08fe-4821-8f09-02a22a065b57	String	jsonType.label
5469604c-e44f-4181-8c10-88e9d7ac6209	true	introspection.token.claim
5469604c-e44f-4181-8c10-88e9d7ac6209	true	access.token.claim
abea88c9-f648-4395-97e1-46dfe8ec8faa	true	introspection.token.claim
abea88c9-f648-4395-97e1-46dfe8ec8faa	true	multivalued
abea88c9-f648-4395-97e1-46dfe8ec8faa	foo	user.attribute
abea88c9-f648-4395-97e1-46dfe8ec8faa	true	access.token.claim
abea88c9-f648-4395-97e1-46dfe8ec8faa	resource_access.${client_id}.roles	claim.name
abea88c9-f648-4395-97e1-46dfe8ec8faa	String	jsonType.label
a7b67101-57b6-46f6-a7ee-0c2083718da9	true	introspection.token.claim
a7b67101-57b6-46f6-a7ee-0c2083718da9	true	access.token.claim
ade61f00-8330-4bdd-b393-ca139d5127ff	true	introspection.token.claim
ade61f00-8330-4bdd-b393-ca139d5127ff	true	multivalued
ade61f00-8330-4bdd-b393-ca139d5127ff	foo	user.attribute
ade61f00-8330-4bdd-b393-ca139d5127ff	true	id.token.claim
ade61f00-8330-4bdd-b393-ca139d5127ff	true	access.token.claim
ade61f00-8330-4bdd-b393-ca139d5127ff	groups	claim.name
ade61f00-8330-4bdd-b393-ca139d5127ff	String	jsonType.label
c69b107d-b5ef-4712-80c6-1cae2f5e21c0	true	introspection.token.claim
c69b107d-b5ef-4712-80c6-1cae2f5e21c0	true	userinfo.token.claim
c69b107d-b5ef-4712-80c6-1cae2f5e21c0	username	user.attribute
c69b107d-b5ef-4712-80c6-1cae2f5e21c0	true	id.token.claim
c69b107d-b5ef-4712-80c6-1cae2f5e21c0	true	access.token.claim
c69b107d-b5ef-4712-80c6-1cae2f5e21c0	upn	claim.name
c69b107d-b5ef-4712-80c6-1cae2f5e21c0	String	jsonType.label
e5483c66-b7e9-4b1d-86e0-08ca579c73d0	true	introspection.token.claim
e5483c66-b7e9-4b1d-86e0-08ca579c73d0	true	id.token.claim
e5483c66-b7e9-4b1d-86e0-08ca579c73d0	true	access.token.claim
73f6da32-093d-474a-bce6-ce960d8b62e1	false	single
73f6da32-093d-474a-bce6-ce960d8b62e1	Basic	attribute.nameformat
73f6da32-093d-474a-bce6-ce960d8b62e1	Role	attribute.name
03d6ffef-1452-4fef-86dc-22c6512fd0b1	true	introspection.token.claim
03d6ffef-1452-4fef-86dc-22c6512fd0b1	true	userinfo.token.claim
03d6ffef-1452-4fef-86dc-22c6512fd0b1	birthdate	user.attribute
03d6ffef-1452-4fef-86dc-22c6512fd0b1	true	id.token.claim
03d6ffef-1452-4fef-86dc-22c6512fd0b1	true	access.token.claim
03d6ffef-1452-4fef-86dc-22c6512fd0b1	birthdate	claim.name
03d6ffef-1452-4fef-86dc-22c6512fd0b1	String	jsonType.label
1d3b66fb-4fe7-4b2f-a74a-2aba117b3899	true	introspection.token.claim
1d3b66fb-4fe7-4b2f-a74a-2aba117b3899	true	userinfo.token.claim
1d3b66fb-4fe7-4b2f-a74a-2aba117b3899	true	id.token.claim
1d3b66fb-4fe7-4b2f-a74a-2aba117b3899	true	access.token.claim
405f5a6f-e05c-457e-b091-050b130672a1	true	introspection.token.claim
405f5a6f-e05c-457e-b091-050b130672a1	true	userinfo.token.claim
405f5a6f-e05c-457e-b091-050b130672a1	firstName	user.attribute
405f5a6f-e05c-457e-b091-050b130672a1	true	id.token.claim
405f5a6f-e05c-457e-b091-050b130672a1	true	access.token.claim
405f5a6f-e05c-457e-b091-050b130672a1	given_name	claim.name
405f5a6f-e05c-457e-b091-050b130672a1	String	jsonType.label
4183f298-aa7f-40d8-9bd6-68d7e7d09830	true	introspection.token.claim
4183f298-aa7f-40d8-9bd6-68d7e7d09830	true	userinfo.token.claim
4183f298-aa7f-40d8-9bd6-68d7e7d09830	middleName	user.attribute
4183f298-aa7f-40d8-9bd6-68d7e7d09830	true	id.token.claim
4183f298-aa7f-40d8-9bd6-68d7e7d09830	true	access.token.claim
4183f298-aa7f-40d8-9bd6-68d7e7d09830	middle_name	claim.name
4183f298-aa7f-40d8-9bd6-68d7e7d09830	String	jsonType.label
4c9c582d-9e68-4c99-b1bf-13790c5ed009	true	introspection.token.claim
4c9c582d-9e68-4c99-b1bf-13790c5ed009	true	userinfo.token.claim
4c9c582d-9e68-4c99-b1bf-13790c5ed009	nickname	user.attribute
4c9c582d-9e68-4c99-b1bf-13790c5ed009	true	id.token.claim
4c9c582d-9e68-4c99-b1bf-13790c5ed009	true	access.token.claim
4c9c582d-9e68-4c99-b1bf-13790c5ed009	nickname	claim.name
4c9c582d-9e68-4c99-b1bf-13790c5ed009	String	jsonType.label
6366159e-375f-4ef3-a1f9-621ba80d389a	true	introspection.token.claim
6366159e-375f-4ef3-a1f9-621ba80d389a	true	userinfo.token.claim
6366159e-375f-4ef3-a1f9-621ba80d389a	profile	user.attribute
6366159e-375f-4ef3-a1f9-621ba80d389a	true	id.token.claim
6366159e-375f-4ef3-a1f9-621ba80d389a	true	access.token.claim
6366159e-375f-4ef3-a1f9-621ba80d389a	profile	claim.name
6366159e-375f-4ef3-a1f9-621ba80d389a	String	jsonType.label
65735626-0600-4eb9-b447-ee626e6e0e53	true	introspection.token.claim
65735626-0600-4eb9-b447-ee626e6e0e53	true	userinfo.token.claim
65735626-0600-4eb9-b447-ee626e6e0e53	locale	user.attribute
65735626-0600-4eb9-b447-ee626e6e0e53	true	id.token.claim
65735626-0600-4eb9-b447-ee626e6e0e53	true	access.token.claim
65735626-0600-4eb9-b447-ee626e6e0e53	locale	claim.name
65735626-0600-4eb9-b447-ee626e6e0e53	String	jsonType.label
682ca6f8-d482-4226-bdb8-52453c4c1c7a	true	introspection.token.claim
682ca6f8-d482-4226-bdb8-52453c4c1c7a	true	userinfo.token.claim
682ca6f8-d482-4226-bdb8-52453c4c1c7a	lastName	user.attribute
682ca6f8-d482-4226-bdb8-52453c4c1c7a	true	id.token.claim
682ca6f8-d482-4226-bdb8-52453c4c1c7a	true	access.token.claim
682ca6f8-d482-4226-bdb8-52453c4c1c7a	family_name	claim.name
682ca6f8-d482-4226-bdb8-52453c4c1c7a	String	jsonType.label
862be9b5-0c17-41c6-be1b-98a688363e73	true	introspection.token.claim
862be9b5-0c17-41c6-be1b-98a688363e73	true	userinfo.token.claim
862be9b5-0c17-41c6-be1b-98a688363e73	website	user.attribute
862be9b5-0c17-41c6-be1b-98a688363e73	true	id.token.claim
862be9b5-0c17-41c6-be1b-98a688363e73	true	access.token.claim
862be9b5-0c17-41c6-be1b-98a688363e73	website	claim.name
862be9b5-0c17-41c6-be1b-98a688363e73	String	jsonType.label
8dd04f02-c349-4199-a81d-8ea1615b1255	true	introspection.token.claim
8dd04f02-c349-4199-a81d-8ea1615b1255	true	userinfo.token.claim
8dd04f02-c349-4199-a81d-8ea1615b1255	picture	user.attribute
8dd04f02-c349-4199-a81d-8ea1615b1255	true	id.token.claim
8dd04f02-c349-4199-a81d-8ea1615b1255	true	access.token.claim
8dd04f02-c349-4199-a81d-8ea1615b1255	picture	claim.name
8dd04f02-c349-4199-a81d-8ea1615b1255	String	jsonType.label
b7644ec1-9a5e-49c5-84b6-e23bfd7db737	true	introspection.token.claim
b7644ec1-9a5e-49c5-84b6-e23bfd7db737	true	userinfo.token.claim
b7644ec1-9a5e-49c5-84b6-e23bfd7db737	username	user.attribute
b7644ec1-9a5e-49c5-84b6-e23bfd7db737	true	id.token.claim
b7644ec1-9a5e-49c5-84b6-e23bfd7db737	true	access.token.claim
b7644ec1-9a5e-49c5-84b6-e23bfd7db737	preferred_username	claim.name
b7644ec1-9a5e-49c5-84b6-e23bfd7db737	String	jsonType.label
c9d999b1-c1da-4c32-8418-561f28e457c1	true	introspection.token.claim
c9d999b1-c1da-4c32-8418-561f28e457c1	true	userinfo.token.claim
c9d999b1-c1da-4c32-8418-561f28e457c1	gender	user.attribute
c9d999b1-c1da-4c32-8418-561f28e457c1	true	id.token.claim
c9d999b1-c1da-4c32-8418-561f28e457c1	true	access.token.claim
c9d999b1-c1da-4c32-8418-561f28e457c1	gender	claim.name
c9d999b1-c1da-4c32-8418-561f28e457c1	String	jsonType.label
d2272714-a8c2-4e04-ba13-9e0c18c1e3a1	true	introspection.token.claim
d2272714-a8c2-4e04-ba13-9e0c18c1e3a1	true	userinfo.token.claim
d2272714-a8c2-4e04-ba13-9e0c18c1e3a1	zoneinfo	user.attribute
d2272714-a8c2-4e04-ba13-9e0c18c1e3a1	true	id.token.claim
d2272714-a8c2-4e04-ba13-9e0c18c1e3a1	true	access.token.claim
d2272714-a8c2-4e04-ba13-9e0c18c1e3a1	zoneinfo	claim.name
d2272714-a8c2-4e04-ba13-9e0c18c1e3a1	String	jsonType.label
e0897524-705e-47e2-8e34-0b346be2df7e	true	introspection.token.claim
e0897524-705e-47e2-8e34-0b346be2df7e	true	userinfo.token.claim
e0897524-705e-47e2-8e34-0b346be2df7e	updatedAt	user.attribute
e0897524-705e-47e2-8e34-0b346be2df7e	true	id.token.claim
e0897524-705e-47e2-8e34-0b346be2df7e	true	access.token.claim
e0897524-705e-47e2-8e34-0b346be2df7e	updated_at	claim.name
e0897524-705e-47e2-8e34-0b346be2df7e	long	jsonType.label
8a9ed477-304d-4e34-81bc-7192763b7d17	true	introspection.token.claim
8a9ed477-304d-4e34-81bc-7192763b7d17	true	userinfo.token.claim
8a9ed477-304d-4e34-81bc-7192763b7d17	emailVerified	user.attribute
8a9ed477-304d-4e34-81bc-7192763b7d17	true	id.token.claim
8a9ed477-304d-4e34-81bc-7192763b7d17	true	access.token.claim
8a9ed477-304d-4e34-81bc-7192763b7d17	email_verified	claim.name
8a9ed477-304d-4e34-81bc-7192763b7d17	boolean	jsonType.label
dd87f6e7-b019-4c66-b9a1-48e7f7ca66cf	true	introspection.token.claim
dd87f6e7-b019-4c66-b9a1-48e7f7ca66cf	true	userinfo.token.claim
dd87f6e7-b019-4c66-b9a1-48e7f7ca66cf	email	user.attribute
dd87f6e7-b019-4c66-b9a1-48e7f7ca66cf	true	id.token.claim
dd87f6e7-b019-4c66-b9a1-48e7f7ca66cf	true	access.token.claim
dd87f6e7-b019-4c66-b9a1-48e7f7ca66cf	email	claim.name
dd87f6e7-b019-4c66-b9a1-48e7f7ca66cf	String	jsonType.label
72a59054-606b-412e-8fe2-13d053526221	formatted	user.attribute.formatted
72a59054-606b-412e-8fe2-13d053526221	country	user.attribute.country
72a59054-606b-412e-8fe2-13d053526221	true	introspection.token.claim
72a59054-606b-412e-8fe2-13d053526221	postal_code	user.attribute.postal_code
72a59054-606b-412e-8fe2-13d053526221	true	userinfo.token.claim
72a59054-606b-412e-8fe2-13d053526221	street	user.attribute.street
72a59054-606b-412e-8fe2-13d053526221	true	id.token.claim
72a59054-606b-412e-8fe2-13d053526221	region	user.attribute.region
72a59054-606b-412e-8fe2-13d053526221	true	access.token.claim
72a59054-606b-412e-8fe2-13d053526221	locality	user.attribute.locality
2f840528-a0a9-493e-a57f-5373c1af2356	true	introspection.token.claim
2f840528-a0a9-493e-a57f-5373c1af2356	true	userinfo.token.claim
2f840528-a0a9-493e-a57f-5373c1af2356	phoneNumberVerified	user.attribute
2f840528-a0a9-493e-a57f-5373c1af2356	true	id.token.claim
2f840528-a0a9-493e-a57f-5373c1af2356	true	access.token.claim
2f840528-a0a9-493e-a57f-5373c1af2356	phone_number_verified	claim.name
2f840528-a0a9-493e-a57f-5373c1af2356	boolean	jsonType.label
9b0fca62-d62e-40f2-85de-b52463b2fa22	true	introspection.token.claim
9b0fca62-d62e-40f2-85de-b52463b2fa22	true	userinfo.token.claim
9b0fca62-d62e-40f2-85de-b52463b2fa22	phoneNumber	user.attribute
9b0fca62-d62e-40f2-85de-b52463b2fa22	true	id.token.claim
9b0fca62-d62e-40f2-85de-b52463b2fa22	true	access.token.claim
9b0fca62-d62e-40f2-85de-b52463b2fa22	phone_number	claim.name
9b0fca62-d62e-40f2-85de-b52463b2fa22	String	jsonType.label
54ef6a5a-d856-4197-b5ba-4dc6a2f70c2a	true	introspection.token.claim
54ef6a5a-d856-4197-b5ba-4dc6a2f70c2a	true	multivalued
54ef6a5a-d856-4197-b5ba-4dc6a2f70c2a	foo	user.attribute
54ef6a5a-d856-4197-b5ba-4dc6a2f70c2a	true	access.token.claim
54ef6a5a-d856-4197-b5ba-4dc6a2f70c2a	realm_access.roles	claim.name
54ef6a5a-d856-4197-b5ba-4dc6a2f70c2a	String	jsonType.label
7990677b-53f5-4205-8d0a-6c192e5629ff	true	introspection.token.claim
7990677b-53f5-4205-8d0a-6c192e5629ff	true	multivalued
7990677b-53f5-4205-8d0a-6c192e5629ff	foo	user.attribute
7990677b-53f5-4205-8d0a-6c192e5629ff	true	access.token.claim
7990677b-53f5-4205-8d0a-6c192e5629ff	resource_access.${client_id}.roles	claim.name
7990677b-53f5-4205-8d0a-6c192e5629ff	String	jsonType.label
7ee80334-995d-4eb3-94ce-81b2cf3bef88	true	introspection.token.claim
7ee80334-995d-4eb3-94ce-81b2cf3bef88	true	access.token.claim
243c9a9d-393f-4332-95df-0ae7bd1b7289	true	introspection.token.claim
243c9a9d-393f-4332-95df-0ae7bd1b7289	true	access.token.claim
0388a318-42b1-4938-8bd9-24aa8364ba75	true	introspection.token.claim
0388a318-42b1-4938-8bd9-24aa8364ba75	true	multivalued
0388a318-42b1-4938-8bd9-24aa8364ba75	foo	user.attribute
0388a318-42b1-4938-8bd9-24aa8364ba75	true	id.token.claim
0388a318-42b1-4938-8bd9-24aa8364ba75	true	access.token.claim
0388a318-42b1-4938-8bd9-24aa8364ba75	groups	claim.name
0388a318-42b1-4938-8bd9-24aa8364ba75	String	jsonType.label
a357e500-3da4-49e9-9deb-b1ce838e4868	true	introspection.token.claim
a357e500-3da4-49e9-9deb-b1ce838e4868	true	userinfo.token.claim
a357e500-3da4-49e9-9deb-b1ce838e4868	username	user.attribute
a357e500-3da4-49e9-9deb-b1ce838e4868	true	id.token.claim
a357e500-3da4-49e9-9deb-b1ce838e4868	true	access.token.claim
a357e500-3da4-49e9-9deb-b1ce838e4868	upn	claim.name
a357e500-3da4-49e9-9deb-b1ce838e4868	String	jsonType.label
183158de-bcf8-4429-9d73-2ad7d81edef7	true	introspection.token.claim
183158de-bcf8-4429-9d73-2ad7d81edef7	true	id.token.claim
183158de-bcf8-4429-9d73-2ad7d81edef7	true	access.token.claim
311b5937-3a69-452d-9391-160c4d5a994c	true	introspection.token.claim
311b5937-3a69-452d-9391-160c4d5a994c	true	userinfo.token.claim
311b5937-3a69-452d-9391-160c4d5a994c	locale	user.attribute
311b5937-3a69-452d-9391-160c4d5a994c	true	id.token.claim
311b5937-3a69-452d-9391-160c4d5a994c	true	access.token.claim
311b5937-3a69-452d-9391-160c4d5a994c	locale	claim.name
311b5937-3a69-452d-9391-160c4d5a994c	String	jsonType.label
\.


--
-- Data for Name: realm; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.realm (id, access_code_lifespan, user_action_lifespan, access_token_lifespan, account_theme, admin_theme, email_theme, enabled, events_enabled, events_expiration, login_theme, name, not_before, password_policy, registration_allowed, remember_me, reset_password_allowed, social, ssl_required, sso_idle_timeout, sso_max_lifespan, update_profile_on_soc_login, verify_email, master_admin_client, login_lifespan, internationalization_enabled, default_locale, reg_email_as_username, admin_events_enabled, admin_events_details_enabled, edit_username_allowed, otp_policy_counter, otp_policy_window, otp_policy_period, otp_policy_digits, otp_policy_alg, otp_policy_type, browser_flow, registration_flow, direct_grant_flow, reset_credentials_flow, client_auth_flow, offline_session_idle_timeout, revoke_refresh_token, access_token_life_implicit, login_with_email_allowed, duplicate_emails_allowed, docker_auth_flow, refresh_token_max_reuse, allow_user_managed_access, sso_max_lifespan_remember_me, sso_idle_timeout_remember_me, default_role) FROM stdin;
767d9b8d-d1e0-46e8-8336-872e7ee443dd	60	300	60	\N	\N	\N	t	f	0	\N	master	0	\N	f	f	f	f	EXTERNAL	1800	36000	f	f	da9bd4e7-bea8-45c2-8d22-acd2f2caba75	1800	f	\N	f	f	f	f	0	1	30	6	HmacSHA1	totp	b36c966b-92ac-4567-aaff-dda8c9cbdb1c	21f9d306-af32-481c-9470-875328ef651d	ca82d390-f8c8-4105-9f7f-95f0442a4563	0f7db7b2-9608-4396-9da7-5ac0d23298e2	4166758c-a967-44ea-a50a-aead01198481	2592000	f	900	t	f	a9628e8a-0970-4232-9624-8e717c21b27f	0	f	0	0	cede3fb9-55db-49b4-a1ab-e107fd07dc5a
44e4f427-7bb6-413b-a887-fff03fedb6fb	60	300	300	\N	\N	\N	t	f	0	\N	measuremanager	0	\N	f	f	f	f	EXTERNAL	1800	36000	f	f	e000e9f7-279c-4b44-9292-350a83cf8059	1800	f	\N	f	f	f	f	0	1	30	6	HmacSHA1	totp	b636c7d9-f0ce-43a1-a442-9675acf8074a	9350a0ab-309b-40ef-8237-4aa7b02183b7	d30a5765-2803-440e-b61f-e0085e2e6ff4	1775b658-b1c3-4d25-bafd-750a712bf0e7	e33ecdd3-53a9-454a-9394-ca502237819f	2592000	f	900	t	f	32554854-cb8b-4602-9d7c-c1bf712bc2d3	0	f	0	0	04ac6b5d-9ff9-4db2-b2e1-f0e20c3d3152
\.


--
-- Data for Name: realm_attribute; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.realm_attribute (name, realm_id, value) FROM stdin;
_browser_header.contentSecurityPolicyReportOnly	767d9b8d-d1e0-46e8-8336-872e7ee443dd	
_browser_header.xContentTypeOptions	767d9b8d-d1e0-46e8-8336-872e7ee443dd	nosniff
_browser_header.referrerPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	no-referrer
_browser_header.xRobotsTag	767d9b8d-d1e0-46e8-8336-872e7ee443dd	none
_browser_header.xFrameOptions	767d9b8d-d1e0-46e8-8336-872e7ee443dd	SAMEORIGIN
_browser_header.contentSecurityPolicy	767d9b8d-d1e0-46e8-8336-872e7ee443dd	frame-src 'self'; frame-ancestors 'self'; object-src 'none';
_browser_header.xXSSProtection	767d9b8d-d1e0-46e8-8336-872e7ee443dd	1; mode=block
_browser_header.strictTransportSecurity	767d9b8d-d1e0-46e8-8336-872e7ee443dd	max-age=31536000; includeSubDomains
bruteForceProtected	767d9b8d-d1e0-46e8-8336-872e7ee443dd	false
permanentLockout	767d9b8d-d1e0-46e8-8336-872e7ee443dd	false
maxTemporaryLockouts	767d9b8d-d1e0-46e8-8336-872e7ee443dd	0
maxFailureWaitSeconds	767d9b8d-d1e0-46e8-8336-872e7ee443dd	900
minimumQuickLoginWaitSeconds	767d9b8d-d1e0-46e8-8336-872e7ee443dd	60
waitIncrementSeconds	767d9b8d-d1e0-46e8-8336-872e7ee443dd	60
quickLoginCheckMilliSeconds	767d9b8d-d1e0-46e8-8336-872e7ee443dd	1000
maxDeltaTimeSeconds	767d9b8d-d1e0-46e8-8336-872e7ee443dd	43200
failureFactor	767d9b8d-d1e0-46e8-8336-872e7ee443dd	30
realmReusableOtpCode	767d9b8d-d1e0-46e8-8336-872e7ee443dd	false
firstBrokerLoginFlowId	767d9b8d-d1e0-46e8-8336-872e7ee443dd	c0358ec7-d894-4538-a00a-0564f3ad55e5
displayName	767d9b8d-d1e0-46e8-8336-872e7ee443dd	Keycloak
displayNameHtml	767d9b8d-d1e0-46e8-8336-872e7ee443dd	<div class="kc-logo-text"><span>Keycloak</span></div>
defaultSignatureAlgorithm	767d9b8d-d1e0-46e8-8336-872e7ee443dd	RS256
offlineSessionMaxLifespanEnabled	767d9b8d-d1e0-46e8-8336-872e7ee443dd	false
offlineSessionMaxLifespan	767d9b8d-d1e0-46e8-8336-872e7ee443dd	5184000
_browser_header.contentSecurityPolicyReportOnly	44e4f427-7bb6-413b-a887-fff03fedb6fb	
_browser_header.xContentTypeOptions	44e4f427-7bb6-413b-a887-fff03fedb6fb	nosniff
_browser_header.referrerPolicy	44e4f427-7bb6-413b-a887-fff03fedb6fb	no-referrer
_browser_header.xRobotsTag	44e4f427-7bb6-413b-a887-fff03fedb6fb	none
_browser_header.xFrameOptions	44e4f427-7bb6-413b-a887-fff03fedb6fb	SAMEORIGIN
_browser_header.contentSecurityPolicy	44e4f427-7bb6-413b-a887-fff03fedb6fb	frame-src 'self'; frame-ancestors 'self'; object-src 'none';
_browser_header.xXSSProtection	44e4f427-7bb6-413b-a887-fff03fedb6fb	1; mode=block
_browser_header.strictTransportSecurity	44e4f427-7bb6-413b-a887-fff03fedb6fb	max-age=31536000; includeSubDomains
bruteForceProtected	44e4f427-7bb6-413b-a887-fff03fedb6fb	false
permanentLockout	44e4f427-7bb6-413b-a887-fff03fedb6fb	false
maxTemporaryLockouts	44e4f427-7bb6-413b-a887-fff03fedb6fb	0
maxFailureWaitSeconds	44e4f427-7bb6-413b-a887-fff03fedb6fb	900
minimumQuickLoginWaitSeconds	44e4f427-7bb6-413b-a887-fff03fedb6fb	60
waitIncrementSeconds	44e4f427-7bb6-413b-a887-fff03fedb6fb	60
quickLoginCheckMilliSeconds	44e4f427-7bb6-413b-a887-fff03fedb6fb	1000
maxDeltaTimeSeconds	44e4f427-7bb6-413b-a887-fff03fedb6fb	43200
failureFactor	44e4f427-7bb6-413b-a887-fff03fedb6fb	30
realmReusableOtpCode	44e4f427-7bb6-413b-a887-fff03fedb6fb	false
defaultSignatureAlgorithm	44e4f427-7bb6-413b-a887-fff03fedb6fb	RS256
offlineSessionMaxLifespanEnabled	44e4f427-7bb6-413b-a887-fff03fedb6fb	false
offlineSessionMaxLifespan	44e4f427-7bb6-413b-a887-fff03fedb6fb	5184000
actionTokenGeneratedByAdminLifespan	44e4f427-7bb6-413b-a887-fff03fedb6fb	43200
actionTokenGeneratedByUserLifespan	44e4f427-7bb6-413b-a887-fff03fedb6fb	300
oauth2DeviceCodeLifespan	44e4f427-7bb6-413b-a887-fff03fedb6fb	600
oauth2DevicePollingInterval	44e4f427-7bb6-413b-a887-fff03fedb6fb	5
webAuthnPolicyRpEntityName	44e4f427-7bb6-413b-a887-fff03fedb6fb	keycloak
webAuthnPolicySignatureAlgorithms	44e4f427-7bb6-413b-a887-fff03fedb6fb	ES256
webAuthnPolicyRpId	44e4f427-7bb6-413b-a887-fff03fedb6fb	
webAuthnPolicyAttestationConveyancePreference	44e4f427-7bb6-413b-a887-fff03fedb6fb	not specified
webAuthnPolicyAuthenticatorAttachment	44e4f427-7bb6-413b-a887-fff03fedb6fb	not specified
webAuthnPolicyRequireResidentKey	44e4f427-7bb6-413b-a887-fff03fedb6fb	not specified
webAuthnPolicyUserVerificationRequirement	44e4f427-7bb6-413b-a887-fff03fedb6fb	not specified
webAuthnPolicyCreateTimeout	44e4f427-7bb6-413b-a887-fff03fedb6fb	0
webAuthnPolicyAvoidSameAuthenticatorRegister	44e4f427-7bb6-413b-a887-fff03fedb6fb	false
webAuthnPolicyRpEntityNamePasswordless	44e4f427-7bb6-413b-a887-fff03fedb6fb	keycloak
webAuthnPolicySignatureAlgorithmsPasswordless	44e4f427-7bb6-413b-a887-fff03fedb6fb	ES256
webAuthnPolicyRpIdPasswordless	44e4f427-7bb6-413b-a887-fff03fedb6fb	
webAuthnPolicyAttestationConveyancePreferencePasswordless	44e4f427-7bb6-413b-a887-fff03fedb6fb	not specified
webAuthnPolicyAuthenticatorAttachmentPasswordless	44e4f427-7bb6-413b-a887-fff03fedb6fb	not specified
webAuthnPolicyRequireResidentKeyPasswordless	44e4f427-7bb6-413b-a887-fff03fedb6fb	not specified
webAuthnPolicyUserVerificationRequirementPasswordless	44e4f427-7bb6-413b-a887-fff03fedb6fb	not specified
webAuthnPolicyCreateTimeoutPasswordless	44e4f427-7bb6-413b-a887-fff03fedb6fb	0
webAuthnPolicyAvoidSameAuthenticatorRegisterPasswordless	44e4f427-7bb6-413b-a887-fff03fedb6fb	false
cibaBackchannelTokenDeliveryMode	44e4f427-7bb6-413b-a887-fff03fedb6fb	poll
cibaExpiresIn	44e4f427-7bb6-413b-a887-fff03fedb6fb	120
cibaInterval	44e4f427-7bb6-413b-a887-fff03fedb6fb	5
cibaAuthRequestedUserHint	44e4f427-7bb6-413b-a887-fff03fedb6fb	login_hint
parRequestUriLifespan	44e4f427-7bb6-413b-a887-fff03fedb6fb	60
firstBrokerLoginFlowId	44e4f427-7bb6-413b-a887-fff03fedb6fb	1ce9cebf-4d68-48fc-a17f-70afb10ac2a7
\.


--
-- Data for Name: realm_default_groups; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.realm_default_groups (realm_id, group_id) FROM stdin;
\.


--
-- Data for Name: realm_enabled_event_types; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.realm_enabled_event_types (realm_id, value) FROM stdin;
\.


--
-- Data for Name: realm_events_listeners; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.realm_events_listeners (realm_id, value) FROM stdin;
767d9b8d-d1e0-46e8-8336-872e7ee443dd	jboss-logging
44e4f427-7bb6-413b-a887-fff03fedb6fb	jboss-logging
\.


--
-- Data for Name: realm_localizations; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.realm_localizations (realm_id, locale, texts) FROM stdin;
\.


--
-- Data for Name: realm_required_credential; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.realm_required_credential (type, form_label, input, secret, realm_id) FROM stdin;
password	password	t	t	767d9b8d-d1e0-46e8-8336-872e7ee443dd
password	password	t	t	44e4f427-7bb6-413b-a887-fff03fedb6fb
\.


--
-- Data for Name: realm_smtp_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.realm_smtp_config (realm_id, value, name) FROM stdin;
\.


--
-- Data for Name: realm_supported_locales; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.realm_supported_locales (realm_id, value) FROM stdin;
\.


--
-- Data for Name: redirect_uris; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.redirect_uris (client_id, value) FROM stdin;
a1142b95-e1b3-4555-8c77-795b329fd5f8	/realms/master/account/*
21f5e158-9ae0-47eb-a8af-5e5413d0f224	/realms/master/account/*
fec6b05c-1521-42c8-b5eb-e83a00d28125	/admin/master/console/*
79437d0c-1a7a-4b84-906a-ce1e5ea6c2c3	/realms/measuremanager/account/*
da4d4a95-8670-4686-9786-f6b581ed61ba	/realms/measuremanager/account/*
b593bc14-7f70-4926-824b-644aa02f48f8	/admin/measuremanager/console/*
\.


--
-- Data for Name: required_action_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.required_action_config (required_action_id, value, name) FROM stdin;
\.


--
-- Data for Name: required_action_provider; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.required_action_provider (id, alias, name, realm_id, enabled, default_action, provider_id, priority) FROM stdin;
dc4fa4a0-1cf7-4925-adae-c1e5cf537872	VERIFY_EMAIL	Verify Email	767d9b8d-d1e0-46e8-8336-872e7ee443dd	t	f	VERIFY_EMAIL	50
2c5311d3-81e1-4086-b600-28a8b6a29b2a	UPDATE_PROFILE	Update Profile	767d9b8d-d1e0-46e8-8336-872e7ee443dd	t	f	UPDATE_PROFILE	40
4fdaa77f-36b1-4199-b1fd-981b79f5cdfb	CONFIGURE_TOTP	Configure OTP	767d9b8d-d1e0-46e8-8336-872e7ee443dd	t	f	CONFIGURE_TOTP	10
4f6e94f6-ef11-4242-bf48-51d9cec32e4e	UPDATE_PASSWORD	Update Password	767d9b8d-d1e0-46e8-8336-872e7ee443dd	t	f	UPDATE_PASSWORD	30
a4308932-6d96-414e-a1f8-2bb9286f650c	TERMS_AND_CONDITIONS	Terms and Conditions	767d9b8d-d1e0-46e8-8336-872e7ee443dd	f	f	TERMS_AND_CONDITIONS	20
59db076d-f7f1-4dd9-a153-d4d129610829	delete_account	Delete Account	767d9b8d-d1e0-46e8-8336-872e7ee443dd	f	f	delete_account	60
b649097f-58af-44a5-a62a-d2ef6827241a	delete_credential	Delete Credential	767d9b8d-d1e0-46e8-8336-872e7ee443dd	t	f	delete_credential	100
1d0aec8f-c810-40ac-8a43-890668142f04	update_user_locale	Update User Locale	767d9b8d-d1e0-46e8-8336-872e7ee443dd	t	f	update_user_locale	1000
03084f2a-0129-47cb-a564-a6fd4e57acec	webauthn-register	Webauthn Register	767d9b8d-d1e0-46e8-8336-872e7ee443dd	t	f	webauthn-register	70
0363ffe1-dec5-4abf-9c33-5f4c5bc8970a	webauthn-register-passwordless	Webauthn Register Passwordless	767d9b8d-d1e0-46e8-8336-872e7ee443dd	t	f	webauthn-register-passwordless	80
db8df71f-affc-4c6a-be08-d8e5364ca8be	VERIFY_PROFILE	Verify Profile	767d9b8d-d1e0-46e8-8336-872e7ee443dd	t	f	VERIFY_PROFILE	90
8c1c654a-96fa-4025-b06b-8350ad523aa0	VERIFY_EMAIL	Verify Email	44e4f427-7bb6-413b-a887-fff03fedb6fb	t	f	VERIFY_EMAIL	50
a9e675f5-f052-4caf-9672-aaab94b0002f	UPDATE_PROFILE	Update Profile	44e4f427-7bb6-413b-a887-fff03fedb6fb	t	f	UPDATE_PROFILE	40
ea11e33c-7a5c-4689-93ec-bc92e3cbe23f	CONFIGURE_TOTP	Configure OTP	44e4f427-7bb6-413b-a887-fff03fedb6fb	t	f	CONFIGURE_TOTP	10
105fe882-f846-4aa9-b5cf-927b23b3c6ac	UPDATE_PASSWORD	Update Password	44e4f427-7bb6-413b-a887-fff03fedb6fb	t	f	UPDATE_PASSWORD	30
7d8c64a5-d614-4f11-b383-253c864173ce	TERMS_AND_CONDITIONS	Terms and Conditions	44e4f427-7bb6-413b-a887-fff03fedb6fb	f	f	TERMS_AND_CONDITIONS	20
c8c02d00-c33e-4195-99f3-02f9330b108f	delete_account	Delete Account	44e4f427-7bb6-413b-a887-fff03fedb6fb	f	f	delete_account	60
786aba8f-e944-4669-8662-5dfa095bd165	delete_credential	Delete Credential	44e4f427-7bb6-413b-a887-fff03fedb6fb	t	f	delete_credential	100
5b9a2ff6-0d90-4758-96a9-7c8c4518638c	update_user_locale	Update User Locale	44e4f427-7bb6-413b-a887-fff03fedb6fb	t	f	update_user_locale	1000
a88c2e5e-b14c-4425-bec5-715d1cfb2ec3	webauthn-register	Webauthn Register	44e4f427-7bb6-413b-a887-fff03fedb6fb	t	f	webauthn-register	70
3be85b7d-e0fc-4cb8-9992-70a2cca4c3ad	webauthn-register-passwordless	Webauthn Register Passwordless	44e4f427-7bb6-413b-a887-fff03fedb6fb	t	f	webauthn-register-passwordless	80
6e079428-2307-4c48-9696-ab6682efcf8c	VERIFY_PROFILE	Verify Profile	44e4f427-7bb6-413b-a887-fff03fedb6fb	t	f	VERIFY_PROFILE	90
\.


--
-- Data for Name: resource_attribute; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.resource_attribute (id, name, value, resource_id) FROM stdin;
\.


--
-- Data for Name: resource_policy; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.resource_policy (resource_id, policy_id) FROM stdin;
\.


--
-- Data for Name: resource_scope; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.resource_scope (resource_id, scope_id) FROM stdin;
\.


--
-- Data for Name: resource_server; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.resource_server (id, allow_rs_remote_mgmt, policy_enforce_mode, decision_strategy) FROM stdin;
\.


--
-- Data for Name: resource_server_perm_ticket; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.resource_server_perm_ticket (id, owner, requester, created_timestamp, granted_timestamp, resource_id, scope_id, resource_server_id, policy_id) FROM stdin;
\.


--
-- Data for Name: resource_server_policy; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.resource_server_policy (id, name, description, type, decision_strategy, logic, resource_server_id, owner) FROM stdin;
\.


--
-- Data for Name: resource_server_resource; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.resource_server_resource (id, name, type, icon_uri, owner, resource_server_id, owner_managed_access, display_name) FROM stdin;
\.


--
-- Data for Name: resource_server_scope; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.resource_server_scope (id, name, icon_uri, resource_server_id, display_name) FROM stdin;
\.


--
-- Data for Name: resource_uris; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.resource_uris (resource_id, value) FROM stdin;
\.


--
-- Data for Name: role_attribute; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.role_attribute (id, role_id, name, value) FROM stdin;
\.


--
-- Data for Name: scope_mapping; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.scope_mapping (client_id, role_id) FROM stdin;
21f5e158-9ae0-47eb-a8af-5e5413d0f224	3e7aa68c-3e39-40fe-add5-feea461c5b2b
21f5e158-9ae0-47eb-a8af-5e5413d0f224	b96ee64d-e253-423d-ba83-74f97ac4c3c9
da4d4a95-8670-4686-9786-f6b581ed61ba	345e2a60-6d0d-4335-9b46-a0ec4a92d65a
da4d4a95-8670-4686-9786-f6b581ed61ba	146fa3ee-ac48-4617-a14b-805f78c5c33d
\.


--
-- Data for Name: scope_policy; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.scope_policy (scope_id, policy_id) FROM stdin;
\.


--
-- Data for Name: user_attribute; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_attribute (name, value, user_id, id, long_value_hash, long_value_hash_lower_case, long_value) FROM stdin;
\.


--
-- Data for Name: user_consent; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_consent (id, client_id, user_id, created_date, last_updated_date, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- Data for Name: user_consent_client_scope; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_consent_client_scope (user_consent_id, scope_id) FROM stdin;
\.


--
-- Data for Name: user_entity; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_entity (id, email, email_constraint, email_verified, enabled, federation_link, first_name, last_name, realm_id, username, created_timestamp, service_account_client_link, not_before) FROM stdin;
5addde5e-fc0d-4716-bb94-47bdd9e711c4	\N	6725582d-cbf1-4627-bb05-e05237a51296	f	t	\N	\N	\N	767d9b8d-d1e0-46e8-8336-872e7ee443dd	admin	1740481503286	\N	0
\.


--
-- Data for Name: user_federation_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_federation_config (user_federation_provider_id, value, name) FROM stdin;
\.


--
-- Data for Name: user_federation_mapper; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_federation_mapper (id, name, federation_provider_id, federation_mapper_type, realm_id) FROM stdin;
\.


--
-- Data for Name: user_federation_mapper_config; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_federation_mapper_config (user_federation_mapper_id, value, name) FROM stdin;
\.


--
-- Data for Name: user_federation_provider; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_federation_provider (id, changed_sync_period, display_name, full_sync_period, last_sync, priority, provider_name, realm_id) FROM stdin;
\.


--
-- Data for Name: user_group_membership; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_group_membership (group_id, user_id) FROM stdin;
\.


--
-- Data for Name: user_required_action; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_required_action (user_id, required_action) FROM stdin;
\.


--
-- Data for Name: user_role_mapping; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_role_mapping (role_id, user_id) FROM stdin;
cede3fb9-55db-49b4-a1ab-e107fd07dc5a	5addde5e-fc0d-4716-bb94-47bdd9e711c4
34bda9d2-2e2a-450d-8cea-d6444a0e8df6	5addde5e-fc0d-4716-bb94-47bdd9e711c4
241518f2-7833-4787-b9ab-91c5e4506137	5addde5e-fc0d-4716-bb94-47bdd9e711c4
1ad95ac4-b903-41b6-a501-5107b94aca0e	5addde5e-fc0d-4716-bb94-47bdd9e711c4
c8ee5ce7-48c6-4f90-bf39-fd05696fbb58	5addde5e-fc0d-4716-bb94-47bdd9e711c4
1fb6b3e9-0cf3-41f2-b20c-b9adb9c6099d	5addde5e-fc0d-4716-bb94-47bdd9e711c4
e208c4f0-2621-4d0c-8255-9b5bacfcbb7f	5addde5e-fc0d-4716-bb94-47bdd9e711c4
39e5273b-84c6-4036-8bea-8c1a19e333c4	5addde5e-fc0d-4716-bb94-47bdd9e711c4
90d43c43-9a56-418f-913a-2d8338b71bba	5addde5e-fc0d-4716-bb94-47bdd9e711c4
97666f7d-c39e-48fc-b9f0-f10c1b39e9b5	5addde5e-fc0d-4716-bb94-47bdd9e711c4
2a6b71a9-f62f-4be9-96f6-483cd04b4dd9	5addde5e-fc0d-4716-bb94-47bdd9e711c4
6bf338fa-76c7-41e6-ae8e-5b497e41c651	5addde5e-fc0d-4716-bb94-47bdd9e711c4
250ebd74-74ae-4230-91d8-8f68bd2369ac	5addde5e-fc0d-4716-bb94-47bdd9e711c4
29685447-f932-4dba-b382-797b974fde89	5addde5e-fc0d-4716-bb94-47bdd9e711c4
5b13cf67-2cca-4795-9f92-8e0c56a6a167	5addde5e-fc0d-4716-bb94-47bdd9e711c4
27f60849-2057-4b4d-80d7-91b147707880	5addde5e-fc0d-4716-bb94-47bdd9e711c4
5cbb362f-b55b-43ac-b3fd-a78ac7b096d9	5addde5e-fc0d-4716-bb94-47bdd9e711c4
81ed6a28-0575-463e-b063-a5b60fe881c1	5addde5e-fc0d-4716-bb94-47bdd9e711c4
096af03b-cebd-4661-8447-98a1e2320e20	5addde5e-fc0d-4716-bb94-47bdd9e711c4
\.


--
-- Data for Name: user_session; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_session (id, auth_method, ip_address, last_session_refresh, login_username, realm_id, remember_me, started, user_id, user_session_state, broker_session_id, broker_user_id) FROM stdin;
\.


--
-- Data for Name: user_session_note; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.user_session_note (user_session, name, value) FROM stdin;
\.


--
-- Data for Name: username_login_failure; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.username_login_failure (realm_id, username, failed_login_not_before, last_failure, last_ip_failure, num_failures) FROM stdin;
\.


--
-- Data for Name: web_origins; Type: TABLE DATA; Schema: public; Owner: keycloak
--

COPY public.web_origins (client_id, value) FROM stdin;
fec6b05c-1521-42c8-b5eb-e83a00d28125	+
b593bc14-7f70-4926-824b-644aa02f48f8	+
\.


--
-- Name: username_login_failure CONSTRAINT_17-2; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.username_login_failure
    ADD CONSTRAINT "CONSTRAINT_17-2" PRIMARY KEY (realm_id, username);


--
-- Name: keycloak_role UK_J3RWUVD56ONTGSUHOGM184WW2-2; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT "UK_J3RWUVD56ONTGSUHOGM184WW2-2" UNIQUE (name, client_realm_constraint);


--
-- Name: client_auth_flow_bindings c_cli_flow_bind; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_auth_flow_bindings
    ADD CONSTRAINT c_cli_flow_bind PRIMARY KEY (client_id, binding_name);


--
-- Name: client_scope_client c_cli_scope_bind; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_scope_client
    ADD CONSTRAINT c_cli_scope_bind PRIMARY KEY (client_id, scope_id);


--
-- Name: client_initial_access cnstr_client_init_acc_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_initial_access
    ADD CONSTRAINT cnstr_client_init_acc_pk PRIMARY KEY (id);


--
-- Name: realm_default_groups con_group_id_def_groups; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT con_group_id_def_groups UNIQUE (group_id);


--
-- Name: broker_link constr_broker_link_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.broker_link
    ADD CONSTRAINT constr_broker_link_pk PRIMARY KEY (identity_provider, user_id);


--
-- Name: client_user_session_note constr_cl_usr_ses_note; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_user_session_note
    ADD CONSTRAINT constr_cl_usr_ses_note PRIMARY KEY (client_session, name);


--
-- Name: component_config constr_component_config_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.component_config
    ADD CONSTRAINT constr_component_config_pk PRIMARY KEY (id);


--
-- Name: component constr_component_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.component
    ADD CONSTRAINT constr_component_pk PRIMARY KEY (id);


--
-- Name: fed_user_required_action constr_fed_required_action; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.fed_user_required_action
    ADD CONSTRAINT constr_fed_required_action PRIMARY KEY (required_action, user_id);


--
-- Name: fed_user_attribute constr_fed_user_attr_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.fed_user_attribute
    ADD CONSTRAINT constr_fed_user_attr_pk PRIMARY KEY (id);


--
-- Name: fed_user_consent constr_fed_user_consent_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.fed_user_consent
    ADD CONSTRAINT constr_fed_user_consent_pk PRIMARY KEY (id);


--
-- Name: fed_user_credential constr_fed_user_cred_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.fed_user_credential
    ADD CONSTRAINT constr_fed_user_cred_pk PRIMARY KEY (id);


--
-- Name: fed_user_group_membership constr_fed_user_group; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.fed_user_group_membership
    ADD CONSTRAINT constr_fed_user_group PRIMARY KEY (group_id, user_id);


--
-- Name: fed_user_role_mapping constr_fed_user_role; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.fed_user_role_mapping
    ADD CONSTRAINT constr_fed_user_role PRIMARY KEY (role_id, user_id);


--
-- Name: federated_user constr_federated_user; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.federated_user
    ADD CONSTRAINT constr_federated_user PRIMARY KEY (id);


--
-- Name: realm_default_groups constr_realm_default_groups; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT constr_realm_default_groups PRIMARY KEY (realm_id, group_id);


--
-- Name: realm_enabled_event_types constr_realm_enabl_event_types; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_enabled_event_types
    ADD CONSTRAINT constr_realm_enabl_event_types PRIMARY KEY (realm_id, value);


--
-- Name: realm_events_listeners constr_realm_events_listeners; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_events_listeners
    ADD CONSTRAINT constr_realm_events_listeners PRIMARY KEY (realm_id, value);


--
-- Name: realm_supported_locales constr_realm_supported_locales; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_supported_locales
    ADD CONSTRAINT constr_realm_supported_locales PRIMARY KEY (realm_id, value);


--
-- Name: identity_provider constraint_2b; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT constraint_2b PRIMARY KEY (internal_id);


--
-- Name: client_attributes constraint_3c; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_attributes
    ADD CONSTRAINT constraint_3c PRIMARY KEY (client_id, name);


--
-- Name: event_entity constraint_4; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.event_entity
    ADD CONSTRAINT constraint_4 PRIMARY KEY (id);


--
-- Name: federated_identity constraint_40; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.federated_identity
    ADD CONSTRAINT constraint_40 PRIMARY KEY (identity_provider, user_id);


--
-- Name: realm constraint_4a; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm
    ADD CONSTRAINT constraint_4a PRIMARY KEY (id);


--
-- Name: client_session_role constraint_5; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_session_role
    ADD CONSTRAINT constraint_5 PRIMARY KEY (client_session, role_id);


--
-- Name: user_session constraint_57; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_session
    ADD CONSTRAINT constraint_57 PRIMARY KEY (id);


--
-- Name: user_federation_provider constraint_5c; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_federation_provider
    ADD CONSTRAINT constraint_5c PRIMARY KEY (id);


--
-- Name: client_session_note constraint_5e; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_session_note
    ADD CONSTRAINT constraint_5e PRIMARY KEY (client_session, name);


--
-- Name: client constraint_7; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT constraint_7 PRIMARY KEY (id);


--
-- Name: client_session constraint_8; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_session
    ADD CONSTRAINT constraint_8 PRIMARY KEY (id);


--
-- Name: scope_mapping constraint_81; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.scope_mapping
    ADD CONSTRAINT constraint_81 PRIMARY KEY (client_id, role_id);


--
-- Name: client_node_registrations constraint_84; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_node_registrations
    ADD CONSTRAINT constraint_84 PRIMARY KEY (client_id, name);


--
-- Name: realm_attribute constraint_9; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_attribute
    ADD CONSTRAINT constraint_9 PRIMARY KEY (name, realm_id);


--
-- Name: realm_required_credential constraint_92; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_required_credential
    ADD CONSTRAINT constraint_92 PRIMARY KEY (realm_id, type);


--
-- Name: keycloak_role constraint_a; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT constraint_a PRIMARY KEY (id);


--
-- Name: admin_event_entity constraint_admin_event_entity; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.admin_event_entity
    ADD CONSTRAINT constraint_admin_event_entity PRIMARY KEY (id);


--
-- Name: authenticator_config_entry constraint_auth_cfg_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.authenticator_config_entry
    ADD CONSTRAINT constraint_auth_cfg_pk PRIMARY KEY (authenticator_id, name);


--
-- Name: authentication_execution constraint_auth_exec_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT constraint_auth_exec_pk PRIMARY KEY (id);


--
-- Name: authentication_flow constraint_auth_flow_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.authentication_flow
    ADD CONSTRAINT constraint_auth_flow_pk PRIMARY KEY (id);


--
-- Name: authenticator_config constraint_auth_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.authenticator_config
    ADD CONSTRAINT constraint_auth_pk PRIMARY KEY (id);


--
-- Name: client_session_auth_status constraint_auth_status_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_session_auth_status
    ADD CONSTRAINT constraint_auth_status_pk PRIMARY KEY (client_session, authenticator);


--
-- Name: user_role_mapping constraint_c; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_role_mapping
    ADD CONSTRAINT constraint_c PRIMARY KEY (role_id, user_id);


--
-- Name: composite_role constraint_composite_role; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT constraint_composite_role PRIMARY KEY (composite, child_role);


--
-- Name: client_session_prot_mapper constraint_cs_pmp_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_session_prot_mapper
    ADD CONSTRAINT constraint_cs_pmp_pk PRIMARY KEY (client_session, protocol_mapper_id);


--
-- Name: identity_provider_config constraint_d; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.identity_provider_config
    ADD CONSTRAINT constraint_d PRIMARY KEY (identity_provider_id, name);


--
-- Name: policy_config constraint_dpc; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.policy_config
    ADD CONSTRAINT constraint_dpc PRIMARY KEY (policy_id, name);


--
-- Name: realm_smtp_config constraint_e; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_smtp_config
    ADD CONSTRAINT constraint_e PRIMARY KEY (realm_id, name);


--
-- Name: credential constraint_f; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT constraint_f PRIMARY KEY (id);


--
-- Name: user_federation_config constraint_f9; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_federation_config
    ADD CONSTRAINT constraint_f9 PRIMARY KEY (user_federation_provider_id, name);


--
-- Name: resource_server_perm_ticket constraint_fapmt; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT constraint_fapmt PRIMARY KEY (id);


--
-- Name: resource_server_resource constraint_farsr; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT constraint_farsr PRIMARY KEY (id);


--
-- Name: resource_server_policy constraint_farsrp; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT constraint_farsrp PRIMARY KEY (id);


--
-- Name: associated_policy constraint_farsrpap; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT constraint_farsrpap PRIMARY KEY (policy_id, associated_policy_id);


--
-- Name: resource_policy constraint_farsrpp; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT constraint_farsrpp PRIMARY KEY (resource_id, policy_id);


--
-- Name: resource_server_scope constraint_farsrs; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT constraint_farsrs PRIMARY KEY (id);


--
-- Name: resource_scope constraint_farsrsp; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT constraint_farsrsp PRIMARY KEY (resource_id, scope_id);


--
-- Name: scope_policy constraint_farsrsps; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT constraint_farsrsps PRIMARY KEY (scope_id, policy_id);


--
-- Name: user_entity constraint_fb; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT constraint_fb PRIMARY KEY (id);


--
-- Name: user_federation_mapper_config constraint_fedmapper_cfg_pm; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_federation_mapper_config
    ADD CONSTRAINT constraint_fedmapper_cfg_pm PRIMARY KEY (user_federation_mapper_id, name);


--
-- Name: user_federation_mapper constraint_fedmapperpm; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT constraint_fedmapperpm PRIMARY KEY (id);


--
-- Name: fed_user_consent_cl_scope constraint_fgrntcsnt_clsc_pm; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.fed_user_consent_cl_scope
    ADD CONSTRAINT constraint_fgrntcsnt_clsc_pm PRIMARY KEY (user_consent_id, scope_id);


--
-- Name: user_consent_client_scope constraint_grntcsnt_clsc_pm; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_consent_client_scope
    ADD CONSTRAINT constraint_grntcsnt_clsc_pm PRIMARY KEY (user_consent_id, scope_id);


--
-- Name: user_consent constraint_grntcsnt_pm; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT constraint_grntcsnt_pm PRIMARY KEY (id);


--
-- Name: keycloak_group constraint_group; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT constraint_group PRIMARY KEY (id);


--
-- Name: group_attribute constraint_group_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.group_attribute
    ADD CONSTRAINT constraint_group_attribute_pk PRIMARY KEY (id);


--
-- Name: group_role_mapping constraint_group_role; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.group_role_mapping
    ADD CONSTRAINT constraint_group_role PRIMARY KEY (role_id, group_id);


--
-- Name: identity_provider_mapper constraint_idpm; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.identity_provider_mapper
    ADD CONSTRAINT constraint_idpm PRIMARY KEY (id);


--
-- Name: idp_mapper_config constraint_idpmconfig; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.idp_mapper_config
    ADD CONSTRAINT constraint_idpmconfig PRIMARY KEY (idp_mapper_id, name);


--
-- Name: migration_model constraint_migmod; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.migration_model
    ADD CONSTRAINT constraint_migmod PRIMARY KEY (id);


--
-- Name: offline_client_session constraint_offl_cl_ses_pk3; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.offline_client_session
    ADD CONSTRAINT constraint_offl_cl_ses_pk3 PRIMARY KEY (user_session_id, client_id, client_storage_provider, external_client_id, offline_flag);


--
-- Name: offline_user_session constraint_offl_us_ses_pk2; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.offline_user_session
    ADD CONSTRAINT constraint_offl_us_ses_pk2 PRIMARY KEY (user_session_id, offline_flag);


--
-- Name: protocol_mapper constraint_pcm; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT constraint_pcm PRIMARY KEY (id);


--
-- Name: protocol_mapper_config constraint_pmconfig; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.protocol_mapper_config
    ADD CONSTRAINT constraint_pmconfig PRIMARY KEY (protocol_mapper_id, name);


--
-- Name: redirect_uris constraint_redirect_uris; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.redirect_uris
    ADD CONSTRAINT constraint_redirect_uris PRIMARY KEY (client_id, value);


--
-- Name: required_action_config constraint_req_act_cfg_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.required_action_config
    ADD CONSTRAINT constraint_req_act_cfg_pk PRIMARY KEY (required_action_id, name);


--
-- Name: required_action_provider constraint_req_act_prv_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.required_action_provider
    ADD CONSTRAINT constraint_req_act_prv_pk PRIMARY KEY (id);


--
-- Name: user_required_action constraint_required_action; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_required_action
    ADD CONSTRAINT constraint_required_action PRIMARY KEY (required_action, user_id);


--
-- Name: resource_uris constraint_resour_uris_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_uris
    ADD CONSTRAINT constraint_resour_uris_pk PRIMARY KEY (resource_id, value);


--
-- Name: role_attribute constraint_role_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.role_attribute
    ADD CONSTRAINT constraint_role_attribute_pk PRIMARY KEY (id);


--
-- Name: user_attribute constraint_user_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_attribute
    ADD CONSTRAINT constraint_user_attribute_pk PRIMARY KEY (id);


--
-- Name: user_group_membership constraint_user_group; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_group_membership
    ADD CONSTRAINT constraint_user_group PRIMARY KEY (group_id, user_id);


--
-- Name: user_session_note constraint_usn_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_session_note
    ADD CONSTRAINT constraint_usn_pk PRIMARY KEY (user_session, name);


--
-- Name: web_origins constraint_web_origins; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.web_origins
    ADD CONSTRAINT constraint_web_origins PRIMARY KEY (client_id, value);


--
-- Name: databasechangeloglock databasechangeloglock_pkey; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.databasechangeloglock
    ADD CONSTRAINT databasechangeloglock_pkey PRIMARY KEY (id);


--
-- Name: client_scope_attributes pk_cl_tmpl_attr; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_scope_attributes
    ADD CONSTRAINT pk_cl_tmpl_attr PRIMARY KEY (scope_id, name);


--
-- Name: client_scope pk_cli_template; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_scope
    ADD CONSTRAINT pk_cli_template PRIMARY KEY (id);


--
-- Name: resource_server pk_resource_server; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server
    ADD CONSTRAINT pk_resource_server PRIMARY KEY (id);


--
-- Name: client_scope_role_mapping pk_template_scope; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_scope_role_mapping
    ADD CONSTRAINT pk_template_scope PRIMARY KEY (scope_id, role_id);


--
-- Name: default_client_scope r_def_cli_scope_bind; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.default_client_scope
    ADD CONSTRAINT r_def_cli_scope_bind PRIMARY KEY (realm_id, scope_id);


--
-- Name: realm_localizations realm_localizations_pkey; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_localizations
    ADD CONSTRAINT realm_localizations_pkey PRIMARY KEY (realm_id, locale);


--
-- Name: resource_attribute res_attr_pk; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_attribute
    ADD CONSTRAINT res_attr_pk PRIMARY KEY (id);


--
-- Name: keycloak_group sibling_names; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT sibling_names UNIQUE (realm_id, parent_group, name);


--
-- Name: identity_provider uk_2daelwnibji49avxsrtuf6xj33; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT uk_2daelwnibji49avxsrtuf6xj33 UNIQUE (provider_alias, realm_id);


--
-- Name: client uk_b71cjlbenv945rb6gcon438at; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT uk_b71cjlbenv945rb6gcon438at UNIQUE (realm_id, client_id);


--
-- Name: client_scope uk_cli_scope; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_scope
    ADD CONSTRAINT uk_cli_scope UNIQUE (realm_id, name);


--
-- Name: user_entity uk_dykn684sl8up1crfei6eckhd7; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT uk_dykn684sl8up1crfei6eckhd7 UNIQUE (realm_id, email_constraint);


--
-- Name: resource_server_resource uk_frsr6t700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT uk_frsr6t700s9v50bu18ws5ha6 UNIQUE (name, owner, resource_server_id);


--
-- Name: resource_server_perm_ticket uk_frsr6t700s9v50bu18ws5pmt; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT uk_frsr6t700s9v50bu18ws5pmt UNIQUE (owner, requester, resource_server_id, resource_id, scope_id);


--
-- Name: resource_server_policy uk_frsrpt700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT uk_frsrpt700s9v50bu18ws5ha6 UNIQUE (name, resource_server_id);


--
-- Name: resource_server_scope uk_frsrst700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT uk_frsrst700s9v50bu18ws5ha6 UNIQUE (name, resource_server_id);


--
-- Name: user_consent uk_jkuwuvd56ontgsuhogm8uewrt; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT uk_jkuwuvd56ontgsuhogm8uewrt UNIQUE (client_id, client_storage_provider, external_client_id, user_id);


--
-- Name: realm uk_orvsdmla56612eaefiq6wl5oi; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm
    ADD CONSTRAINT uk_orvsdmla56612eaefiq6wl5oi UNIQUE (name);


--
-- Name: user_entity uk_ru8tt6t700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT uk_ru8tt6t700s9v50bu18ws5ha6 UNIQUE (realm_id, username);


--
-- Name: fed_user_attr_long_values; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX fed_user_attr_long_values ON public.fed_user_attribute USING btree (long_value_hash, name);


--
-- Name: fed_user_attr_long_values_lower_case; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX fed_user_attr_long_values_lower_case ON public.fed_user_attribute USING btree (long_value_hash_lower_case, name);


--
-- Name: idx_admin_event_time; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_admin_event_time ON public.admin_event_entity USING btree (realm_id, admin_event_time);


--
-- Name: idx_assoc_pol_assoc_pol_id; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_assoc_pol_assoc_pol_id ON public.associated_policy USING btree (associated_policy_id);


--
-- Name: idx_auth_config_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_auth_config_realm ON public.authenticator_config USING btree (realm_id);


--
-- Name: idx_auth_exec_flow; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_auth_exec_flow ON public.authentication_execution USING btree (flow_id);


--
-- Name: idx_auth_exec_realm_flow; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_auth_exec_realm_flow ON public.authentication_execution USING btree (realm_id, flow_id);


--
-- Name: idx_auth_flow_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_auth_flow_realm ON public.authentication_flow USING btree (realm_id);


--
-- Name: idx_cl_clscope; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_cl_clscope ON public.client_scope_client USING btree (scope_id);


--
-- Name: idx_client_att_by_name_value; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_client_att_by_name_value ON public.client_attributes USING btree (name, substr(value, 1, 255));


--
-- Name: idx_client_id; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_client_id ON public.client USING btree (client_id);


--
-- Name: idx_client_init_acc_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_client_init_acc_realm ON public.client_initial_access USING btree (realm_id);


--
-- Name: idx_client_session_session; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_client_session_session ON public.client_session USING btree (session_id);


--
-- Name: idx_clscope_attrs; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_clscope_attrs ON public.client_scope_attributes USING btree (scope_id);


--
-- Name: idx_clscope_cl; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_clscope_cl ON public.client_scope_client USING btree (client_id);


--
-- Name: idx_clscope_protmap; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_clscope_protmap ON public.protocol_mapper USING btree (client_scope_id);


--
-- Name: idx_clscope_role; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_clscope_role ON public.client_scope_role_mapping USING btree (scope_id);


--
-- Name: idx_compo_config_compo; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_compo_config_compo ON public.component_config USING btree (component_id);


--
-- Name: idx_component_provider_type; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_component_provider_type ON public.component USING btree (provider_type);


--
-- Name: idx_component_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_component_realm ON public.component USING btree (realm_id);


--
-- Name: idx_composite; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_composite ON public.composite_role USING btree (composite);


--
-- Name: idx_composite_child; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_composite_child ON public.composite_role USING btree (child_role);


--
-- Name: idx_defcls_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_defcls_realm ON public.default_client_scope USING btree (realm_id);


--
-- Name: idx_defcls_scope; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_defcls_scope ON public.default_client_scope USING btree (scope_id);


--
-- Name: idx_event_time; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_event_time ON public.event_entity USING btree (realm_id, event_time);


--
-- Name: idx_fedidentity_feduser; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fedidentity_feduser ON public.federated_identity USING btree (federated_user_id);


--
-- Name: idx_fedidentity_user; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fedidentity_user ON public.federated_identity USING btree (user_id);


--
-- Name: idx_fu_attribute; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_attribute ON public.fed_user_attribute USING btree (user_id, realm_id, name);


--
-- Name: idx_fu_cnsnt_ext; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_cnsnt_ext ON public.fed_user_consent USING btree (user_id, client_storage_provider, external_client_id);


--
-- Name: idx_fu_consent; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_consent ON public.fed_user_consent USING btree (user_id, client_id);


--
-- Name: idx_fu_consent_ru; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_consent_ru ON public.fed_user_consent USING btree (realm_id, user_id);


--
-- Name: idx_fu_credential; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_credential ON public.fed_user_credential USING btree (user_id, type);


--
-- Name: idx_fu_credential_ru; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_credential_ru ON public.fed_user_credential USING btree (realm_id, user_id);


--
-- Name: idx_fu_group_membership; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_group_membership ON public.fed_user_group_membership USING btree (user_id, group_id);


--
-- Name: idx_fu_group_membership_ru; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_group_membership_ru ON public.fed_user_group_membership USING btree (realm_id, user_id);


--
-- Name: idx_fu_required_action; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_required_action ON public.fed_user_required_action USING btree (user_id, required_action);


--
-- Name: idx_fu_required_action_ru; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_required_action_ru ON public.fed_user_required_action USING btree (realm_id, user_id);


--
-- Name: idx_fu_role_mapping; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_role_mapping ON public.fed_user_role_mapping USING btree (user_id, role_id);


--
-- Name: idx_fu_role_mapping_ru; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_fu_role_mapping_ru ON public.fed_user_role_mapping USING btree (realm_id, user_id);


--
-- Name: idx_group_att_by_name_value; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_group_att_by_name_value ON public.group_attribute USING btree (name, ((value)::character varying(250)));


--
-- Name: idx_group_attr_group; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_group_attr_group ON public.group_attribute USING btree (group_id);


--
-- Name: idx_group_role_mapp_group; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_group_role_mapp_group ON public.group_role_mapping USING btree (group_id);


--
-- Name: idx_id_prov_mapp_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_id_prov_mapp_realm ON public.identity_provider_mapper USING btree (realm_id);


--
-- Name: idx_ident_prov_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_ident_prov_realm ON public.identity_provider USING btree (realm_id);


--
-- Name: idx_keycloak_role_client; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_keycloak_role_client ON public.keycloak_role USING btree (client);


--
-- Name: idx_keycloak_role_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_keycloak_role_realm ON public.keycloak_role USING btree (realm);


--
-- Name: idx_offline_css_preload; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_offline_css_preload ON public.offline_client_session USING btree (client_id, offline_flag);


--
-- Name: idx_offline_uss_by_user; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_offline_uss_by_user ON public.offline_user_session USING btree (user_id, realm_id, offline_flag);


--
-- Name: idx_offline_uss_by_usersess; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_offline_uss_by_usersess ON public.offline_user_session USING btree (realm_id, offline_flag, user_session_id);


--
-- Name: idx_offline_uss_createdon; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_offline_uss_createdon ON public.offline_user_session USING btree (created_on);


--
-- Name: idx_offline_uss_preload; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_offline_uss_preload ON public.offline_user_session USING btree (offline_flag, created_on, user_session_id);


--
-- Name: idx_protocol_mapper_client; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_protocol_mapper_client ON public.protocol_mapper USING btree (client_id);


--
-- Name: idx_realm_attr_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_realm_attr_realm ON public.realm_attribute USING btree (realm_id);


--
-- Name: idx_realm_clscope; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_realm_clscope ON public.client_scope USING btree (realm_id);


--
-- Name: idx_realm_def_grp_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_realm_def_grp_realm ON public.realm_default_groups USING btree (realm_id);


--
-- Name: idx_realm_evt_list_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_realm_evt_list_realm ON public.realm_events_listeners USING btree (realm_id);


--
-- Name: idx_realm_evt_types_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_realm_evt_types_realm ON public.realm_enabled_event_types USING btree (realm_id);


--
-- Name: idx_realm_master_adm_cli; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_realm_master_adm_cli ON public.realm USING btree (master_admin_client);


--
-- Name: idx_realm_supp_local_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_realm_supp_local_realm ON public.realm_supported_locales USING btree (realm_id);


--
-- Name: idx_redir_uri_client; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_redir_uri_client ON public.redirect_uris USING btree (client_id);


--
-- Name: idx_req_act_prov_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_req_act_prov_realm ON public.required_action_provider USING btree (realm_id);


--
-- Name: idx_res_policy_policy; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_res_policy_policy ON public.resource_policy USING btree (policy_id);


--
-- Name: idx_res_scope_scope; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_res_scope_scope ON public.resource_scope USING btree (scope_id);


--
-- Name: idx_res_serv_pol_res_serv; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_res_serv_pol_res_serv ON public.resource_server_policy USING btree (resource_server_id);


--
-- Name: idx_res_srv_res_res_srv; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_res_srv_res_res_srv ON public.resource_server_resource USING btree (resource_server_id);


--
-- Name: idx_res_srv_scope_res_srv; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_res_srv_scope_res_srv ON public.resource_server_scope USING btree (resource_server_id);


--
-- Name: idx_role_attribute; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_role_attribute ON public.role_attribute USING btree (role_id);


--
-- Name: idx_role_clscope; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_role_clscope ON public.client_scope_role_mapping USING btree (role_id);


--
-- Name: idx_scope_mapping_role; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_scope_mapping_role ON public.scope_mapping USING btree (role_id);


--
-- Name: idx_scope_policy_policy; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_scope_policy_policy ON public.scope_policy USING btree (policy_id);


--
-- Name: idx_update_time; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_update_time ON public.migration_model USING btree (update_time);


--
-- Name: idx_us_sess_id_on_cl_sess; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_us_sess_id_on_cl_sess ON public.offline_client_session USING btree (user_session_id);


--
-- Name: idx_usconsent_clscope; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_usconsent_clscope ON public.user_consent_client_scope USING btree (user_consent_id);


--
-- Name: idx_user_attribute; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_user_attribute ON public.user_attribute USING btree (user_id);


--
-- Name: idx_user_attribute_name; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_user_attribute_name ON public.user_attribute USING btree (name, value);


--
-- Name: idx_user_consent; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_user_consent ON public.user_consent USING btree (user_id);


--
-- Name: idx_user_credential; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_user_credential ON public.credential USING btree (user_id);


--
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_user_email ON public.user_entity USING btree (email);


--
-- Name: idx_user_group_mapping; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_user_group_mapping ON public.user_group_membership USING btree (user_id);


--
-- Name: idx_user_reqactions; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_user_reqactions ON public.user_required_action USING btree (user_id);


--
-- Name: idx_user_role_mapping; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_user_role_mapping ON public.user_role_mapping USING btree (user_id);


--
-- Name: idx_user_service_account; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_user_service_account ON public.user_entity USING btree (realm_id, service_account_client_link);


--
-- Name: idx_usr_fed_map_fed_prv; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_usr_fed_map_fed_prv ON public.user_federation_mapper USING btree (federation_provider_id);


--
-- Name: idx_usr_fed_map_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_usr_fed_map_realm ON public.user_federation_mapper USING btree (realm_id);


--
-- Name: idx_usr_fed_prv_realm; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_usr_fed_prv_realm ON public.user_federation_provider USING btree (realm_id);


--
-- Name: idx_web_orig_client; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX idx_web_orig_client ON public.web_origins USING btree (client_id);


--
-- Name: user_attr_long_values; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX user_attr_long_values ON public.user_attribute USING btree (long_value_hash, name);


--
-- Name: user_attr_long_values_lower_case; Type: INDEX; Schema: public; Owner: keycloak
--

CREATE INDEX user_attr_long_values_lower_case ON public.user_attribute USING btree (long_value_hash_lower_case, name);


--
-- Name: client_session_auth_status auth_status_constraint; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_session_auth_status
    ADD CONSTRAINT auth_status_constraint FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: identity_provider fk2b4ebc52ae5c3b34; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT fk2b4ebc52ae5c3b34 FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: client_attributes fk3c47c64beacca966; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_attributes
    ADD CONSTRAINT fk3c47c64beacca966 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: federated_identity fk404288b92ef007a6; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.federated_identity
    ADD CONSTRAINT fk404288b92ef007a6 FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: client_node_registrations fk4129723ba992f594; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_node_registrations
    ADD CONSTRAINT fk4129723ba992f594 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: client_session_note fk5edfb00ff51c2736; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_session_note
    ADD CONSTRAINT fk5edfb00ff51c2736 FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: user_session_note fk5edfb00ff51d3472; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_session_note
    ADD CONSTRAINT fk5edfb00ff51d3472 FOREIGN KEY (user_session) REFERENCES public.user_session(id);


--
-- Name: client_session_role fk_11b7sgqw18i532811v7o2dv76; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_session_role
    ADD CONSTRAINT fk_11b7sgqw18i532811v7o2dv76 FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: redirect_uris fk_1burs8pb4ouj97h5wuppahv9f; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.redirect_uris
    ADD CONSTRAINT fk_1burs8pb4ouj97h5wuppahv9f FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: user_federation_provider fk_1fj32f6ptolw2qy60cd8n01e8; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_federation_provider
    ADD CONSTRAINT fk_1fj32f6ptolw2qy60cd8n01e8 FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: client_session_prot_mapper fk_33a8sgqw18i532811v7o2dk89; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_session_prot_mapper
    ADD CONSTRAINT fk_33a8sgqw18i532811v7o2dk89 FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: realm_required_credential fk_5hg65lybevavkqfki3kponh9v; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_required_credential
    ADD CONSTRAINT fk_5hg65lybevavkqfki3kponh9v FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: resource_attribute fk_5hrm2vlf9ql5fu022kqepovbr; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_attribute
    ADD CONSTRAINT fk_5hrm2vlf9ql5fu022kqepovbr FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: user_attribute fk_5hrm2vlf9ql5fu043kqepovbr; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_attribute
    ADD CONSTRAINT fk_5hrm2vlf9ql5fu043kqepovbr FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: user_required_action fk_6qj3w1jw9cvafhe19bwsiuvmd; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_required_action
    ADD CONSTRAINT fk_6qj3w1jw9cvafhe19bwsiuvmd FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: keycloak_role fk_6vyqfe4cn4wlq8r6kt5vdsj5c; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT fk_6vyqfe4cn4wlq8r6kt5vdsj5c FOREIGN KEY (realm) REFERENCES public.realm(id);


--
-- Name: realm_smtp_config fk_70ej8xdxgxd0b9hh6180irr0o; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_smtp_config
    ADD CONSTRAINT fk_70ej8xdxgxd0b9hh6180irr0o FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_attribute fk_8shxd6l3e9atqukacxgpffptw; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_attribute
    ADD CONSTRAINT fk_8shxd6l3e9atqukacxgpffptw FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: composite_role fk_a63wvekftu8jo1pnj81e7mce2; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT fk_a63wvekftu8jo1pnj81e7mce2 FOREIGN KEY (composite) REFERENCES public.keycloak_role(id);


--
-- Name: authentication_execution fk_auth_exec_flow; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT fk_auth_exec_flow FOREIGN KEY (flow_id) REFERENCES public.authentication_flow(id);


--
-- Name: authentication_execution fk_auth_exec_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT fk_auth_exec_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: authentication_flow fk_auth_flow_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.authentication_flow
    ADD CONSTRAINT fk_auth_flow_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: authenticator_config fk_auth_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.authenticator_config
    ADD CONSTRAINT fk_auth_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: client_session fk_b4ao2vcvat6ukau74wbwtfqo1; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_session
    ADD CONSTRAINT fk_b4ao2vcvat6ukau74wbwtfqo1 FOREIGN KEY (session_id) REFERENCES public.user_session(id);


--
-- Name: user_role_mapping fk_c4fqv34p1mbylloxang7b1q3l; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_role_mapping
    ADD CONSTRAINT fk_c4fqv34p1mbylloxang7b1q3l FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: client_scope_attributes fk_cl_scope_attr_scope; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_scope_attributes
    ADD CONSTRAINT fk_cl_scope_attr_scope FOREIGN KEY (scope_id) REFERENCES public.client_scope(id);


--
-- Name: client_scope_role_mapping fk_cl_scope_rm_scope; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_scope_role_mapping
    ADD CONSTRAINT fk_cl_scope_rm_scope FOREIGN KEY (scope_id) REFERENCES public.client_scope(id);


--
-- Name: client_user_session_note fk_cl_usr_ses_note; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_user_session_note
    ADD CONSTRAINT fk_cl_usr_ses_note FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: protocol_mapper fk_cli_scope_mapper; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT fk_cli_scope_mapper FOREIGN KEY (client_scope_id) REFERENCES public.client_scope(id);


--
-- Name: client_initial_access fk_client_init_acc_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.client_initial_access
    ADD CONSTRAINT fk_client_init_acc_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: component_config fk_component_config; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.component_config
    ADD CONSTRAINT fk_component_config FOREIGN KEY (component_id) REFERENCES public.component(id);


--
-- Name: component fk_component_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.component
    ADD CONSTRAINT fk_component_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_default_groups fk_def_groups_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT fk_def_groups_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: user_federation_mapper_config fk_fedmapper_cfg; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_federation_mapper_config
    ADD CONSTRAINT fk_fedmapper_cfg FOREIGN KEY (user_federation_mapper_id) REFERENCES public.user_federation_mapper(id);


--
-- Name: user_federation_mapper fk_fedmapperpm_fedprv; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT fk_fedmapperpm_fedprv FOREIGN KEY (federation_provider_id) REFERENCES public.user_federation_provider(id);


--
-- Name: user_federation_mapper fk_fedmapperpm_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT fk_fedmapperpm_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: associated_policy fk_frsr5s213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT fk_frsr5s213xcx4wnkog82ssrfy FOREIGN KEY (associated_policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: scope_policy fk_frsrasp13xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT fk_frsrasp13xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog82sspmt; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog82sspmt FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_server_resource fk_frsrho213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT fk_frsrho213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog83sspmt; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog83sspmt FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog84sspmt; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog84sspmt FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: associated_policy fk_frsrpas14xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT fk_frsrpas14xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: scope_policy fk_frsrpass3xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT fk_frsrpass3xcx4wnkog82ssrfy FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: resource_server_perm_ticket fk_frsrpo2128cx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrpo2128cx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_server_policy fk_frsrpo213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT fk_frsrpo213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_scope fk_frsrpos13xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT fk_frsrpos13xcx4wnkog82ssrfy FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_policy fk_frsrpos53xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT fk_frsrpos53xcx4wnkog82ssrfy FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_policy fk_frsrpp213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT fk_frsrpp213xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_scope fk_frsrps213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT fk_frsrps213xcx4wnkog82ssrfy FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: resource_server_scope fk_frsrso213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT fk_frsrso213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: composite_role fk_gr7thllb9lu8q4vqa4524jjy8; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT fk_gr7thllb9lu8q4vqa4524jjy8 FOREIGN KEY (child_role) REFERENCES public.keycloak_role(id);


--
-- Name: user_consent_client_scope fk_grntcsnt_clsc_usc; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_consent_client_scope
    ADD CONSTRAINT fk_grntcsnt_clsc_usc FOREIGN KEY (user_consent_id) REFERENCES public.user_consent(id);


--
-- Name: user_consent fk_grntcsnt_user; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT fk_grntcsnt_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: group_attribute fk_group_attribute_group; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.group_attribute
    ADD CONSTRAINT fk_group_attribute_group FOREIGN KEY (group_id) REFERENCES public.keycloak_group(id);


--
-- Name: group_role_mapping fk_group_role_group; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.group_role_mapping
    ADD CONSTRAINT fk_group_role_group FOREIGN KEY (group_id) REFERENCES public.keycloak_group(id);


--
-- Name: realm_enabled_event_types fk_h846o4h0w8epx5nwedrf5y69j; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_enabled_event_types
    ADD CONSTRAINT fk_h846o4h0w8epx5nwedrf5y69j FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_events_listeners fk_h846o4h0w8epx5nxev9f5y69j; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_events_listeners
    ADD CONSTRAINT fk_h846o4h0w8epx5nxev9f5y69j FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: identity_provider_mapper fk_idpm_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.identity_provider_mapper
    ADD CONSTRAINT fk_idpm_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: idp_mapper_config fk_idpmconfig; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.idp_mapper_config
    ADD CONSTRAINT fk_idpmconfig FOREIGN KEY (idp_mapper_id) REFERENCES public.identity_provider_mapper(id);


--
-- Name: web_origins fk_lojpho213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.web_origins
    ADD CONSTRAINT fk_lojpho213xcx4wnkog82ssrfy FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: scope_mapping fk_ouse064plmlr732lxjcn1q5f1; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.scope_mapping
    ADD CONSTRAINT fk_ouse064plmlr732lxjcn1q5f1 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: protocol_mapper fk_pcm_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT fk_pcm_realm FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: credential fk_pfyr0glasqyl0dei3kl69r6v0; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT fk_pfyr0glasqyl0dei3kl69r6v0 FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: protocol_mapper_config fk_pmconfig; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.protocol_mapper_config
    ADD CONSTRAINT fk_pmconfig FOREIGN KEY (protocol_mapper_id) REFERENCES public.protocol_mapper(id);


--
-- Name: default_client_scope fk_r_def_cli_scope_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.default_client_scope
    ADD CONSTRAINT fk_r_def_cli_scope_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: required_action_provider fk_req_act_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.required_action_provider
    ADD CONSTRAINT fk_req_act_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: resource_uris fk_resource_server_uris; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.resource_uris
    ADD CONSTRAINT fk_resource_server_uris FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: role_attribute fk_role_attribute_id; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.role_attribute
    ADD CONSTRAINT fk_role_attribute_id FOREIGN KEY (role_id) REFERENCES public.keycloak_role(id);


--
-- Name: realm_supported_locales fk_supported_locales_realm; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.realm_supported_locales
    ADD CONSTRAINT fk_supported_locales_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: user_federation_config fk_t13hpu1j94r2ebpekr39x5eu5; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_federation_config
    ADD CONSTRAINT fk_t13hpu1j94r2ebpekr39x5eu5 FOREIGN KEY (user_federation_provider_id) REFERENCES public.user_federation_provider(id);


--
-- Name: user_group_membership fk_user_group_user; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.user_group_membership
    ADD CONSTRAINT fk_user_group_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: policy_config fkdc34197cf864c4e43; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.policy_config
    ADD CONSTRAINT fkdc34197cf864c4e43 FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: identity_provider_config fkdc4897cf864c4e43; Type: FK CONSTRAINT; Schema: public; Owner: keycloak
--

ALTER TABLE ONLY public.identity_provider_config
    ADD CONSTRAINT fkdc4897cf864c4e43 FOREIGN KEY (identity_provider_id) REFERENCES public.identity_provider(internal_id);


--
-- PostgreSQL database dump complete
--

