import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?
    
    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = (scene as? UIWindowScene) else { return }
        
        // Create the window with the scene's coordinate space
        let window = UIWindow(windowScene: windowScene)
        self.window = window
        
        let viewController = ViewController()
        
        // Check if this is the external display
        if windowScene.screen != UIScreen.main {
            // This is the projector - mark it
            viewController.isExternalDisplay = true
            viewController.externalScreen = windowScene.screen
            print("✅ Running on external display (projector) - MIRRORING mode")
        } else {
            print("✅ Running on main iPad display")
        }
        
        window.rootViewController = viewController
        window.makeKeyAndVisible()
    }
}
