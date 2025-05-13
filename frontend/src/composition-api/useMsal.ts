import {
  type AccountInfo,
  type AuthenticationResult, type AuthError,
  InteractionStatus,
  PublicClientApplication
} from "@azure/msal-browser";
import {getCurrentInstance, type Ref, toRefs} from "vue";

export type MsalContext = {
  instance: PublicClientApplication,
  accounts: Ref<AccountInfo[]>,
  inProgress: Ref<InteractionStatus>
}

let accountIsSet = false;

export function useMsal(): MsalContext {
  const internalInstance = getCurrentInstance();
  if (!internalInstance) {
    throw "useMsal() cannot be called outside the setup() function of a component";
  }
  const {instance, accounts, inProgress} = toRefs(internalInstance.appContext.config.globalProperties.$msal);

  if (!instance || !accounts || !inProgress) {
    throw "Please install the msalPlugin";
  }

  if (inProgress.value === InteractionStatus.Startup) {
    instance.value.initialize().then(() => {
      instance.value.handleRedirectPromise()
        .then((response: AuthenticationResult | null) => {
          if (response && response.account) {
            console.log("LOGIN (handleRedirect): Account found in response:", response.account);
            instance.value.setActiveAccount(response.account);
            accountIsSet = true;
          } else {
            const currentAccounts = instance.value.getAllAccounts();
            if (currentAccounts.length > 0) {
              console.log("LOGIN (handleRedirect): Setting active account from existing accounts:", currentAccounts[0]);
              instance.value.setActiveAccount(currentAccounts[0]);
              accountIsSet = true;
            } else {
              console.log("LOGIN (handleRedirect): No account found in response and no existing accounts.");
            }
          }
        })
        .catch((error: AuthError) => {
          // Errors should be handled by listening to the LOGIN_FAILURE event
          console.error("LOGIN (handleRedirect): Error during handleRedirectPromise:", error);
          return;
        })
        .finally(() => {
          console.log("LOGIN (handleRedirect): finally block reached. Account is set:", accountIsSet);
          // Erst hier sollten Operationen gestartet werden, die einen gültigen Token benötigen.
          // Z.B. Initialisierung der UI, die Daten lädt.
          // initializeUiAndLoadData();
        });
    });
  }

  return {
    instance: instance.value,
    accounts,
    inProgress
  }
}
